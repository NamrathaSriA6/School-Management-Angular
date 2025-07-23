import { Component, OnInit } from '@angular/core';
import { Database, ref, set } from '@angular/fire/database';
import { format } from 'date-fns';
import { FirebaseDataService } from '../../services/firebase-data.service';

@Component({
  selector: 'app-attendance',
  standalone: false,
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  selectedMonth: string = format(new Date(), 'yyyy-MM'); // e.g., "2025-07"
  selectedDepartment: string = '';
  classes: string[] = [
    'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
    'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];
  selectedClass: string = '';
  selectedSection: string = '';
  departments: string[] = [
    'Telugu', 'Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science'
  ];
  sections: string[] = ['A', 'B', 'C'];
  submitCount: number = 0;
  teachers: any[] = [];
  days: number[] = [];
  today: number = 0;
  popupMessage: string = '';
  popupType: 'success' | 'error' = 'success';
  popupTimeout: any;

  attendanceData: { [teacherId: string]: { [day: number]: boolean | null } } = {};
  hasModified: boolean = false;

  constructor(
    private firebaseService: FirebaseDataService,
    private db: Database
  ) {}


  ngOnInit(): void {
    this.generateDays();
    this.updateToday();
  }

  onMonthChange(): void {
    this.generateDays();
    this.initAttendanceData();
    this.updateToday();
  }

  fetchTeachers() {
    if (!this.selectedClass || !this.selectedSection) return;

    this.firebaseService.getTeachers().subscribe(data => {
      this.teachers = data.filter(t =>
        (t.class || '') === this.selectedClass &&
        (t.section || '') === this.selectedSection
      );

      this.generateDays();
      this.initAttendanceData();
    });
  }

  generateDays() {
    if (!this.selectedMonth) return;
    const [year, month] = this.selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  initAttendanceData() {
    this.attendanceData = {};
    this.teachers.forEach(teacher => {
      this.attendanceData[teacher.teacherId] = {};
      this.days.forEach(day => {
        this.attendanceData[teacher.teacherId][day] = null;
      });
    });
  }

  markAttendance(teacherId: string, day: number, isPresent: boolean) {
    if (!this.isToday(day)) return;
    this.attendanceData[teacherId][day] = isPresent;
    this.hasModified = true;
  }

  getAttendanceValue(teacherId: string, day: number): boolean | null {
    return this.attendanceData?.[teacherId]?.[day] ?? null;
  }

  isToday(day: number): boolean {
    const now = new Date();
    const [year, month] = this.selectedMonth.split('-').map(Number);
    return (
      now.getDate() === day &&
      now.getMonth() + 1 === month &&
      now.getFullYear() === year
    );
  }

  showPopup(message: string, type: 'success' | 'error' = 'success') {
    this.popupMessage = message;
    this.popupType = type;

    // Auto-close after 4 seconds
    if (this.popupTimeout) clearTimeout(this.popupTimeout);
    this.popupTimeout = setTimeout(() => {
      this.popupMessage = '';
    }, 4000);
  }

  closePopup() {
    this.popupMessage = '';
    if (this.popupTimeout) clearTimeout(this.popupTimeout);
  }


  lockTodayCells() {
  if (this.today === 0) return;
  Object.keys(this.attendanceData).forEach(teacherId => {
    this.attendanceData[teacherId][this.today] = this.attendanceData[teacherId][this.today];
  });
}

  updateToday() {
    const now = new Date();
    const [year, month] = this.selectedMonth.split('-').map(Number);

    // If selected month is current month
    if (now.getMonth() + 1 === month && now.getFullYear() === year) {
      this.today = now.getDate();
    } else {
      this.today = 0;
    }
}



  submitAttendance() {
      if (this.submitCount >= 2) {
        alert('Attendance cannot be modified further for today.');
        return;
      }

      const yearMonth = this.selectedMonth;
      const path = `attendance/teachers/${this.selectedDepartment}/${this.selectedSection}/${yearMonth}`;

      set(ref(this.db, path), this.attendanceData)
        .then(() => {
          this.submitCount++;

          if (this.submitCount === 1) {
            this.showPopup('Attendance submitted successfully! You can modify it one more time.');
          } else if (this.submitCount === 2) {
            this.showPopup('Attendance finalized! No more changes allowed.');
            this.lockTodayCells();
          }
        })
        .catch(err => {
          console.error('Error submitting attendance:', err);
        });
    }
}
