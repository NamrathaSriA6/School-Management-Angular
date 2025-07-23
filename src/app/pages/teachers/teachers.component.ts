import { Component, OnInit } from '@angular/core';
import { FirebaseDataService } from '../../services/firebase-data.service';

interface Teacher {
  key?: string | null;
  teacherId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  department: string;
  section?: string;
  class?: string;
  phone: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-teachers',
  standalone: false,
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  departments: string[] = ['Telugu', 'Hindi', 'English', 'Mathematics', 'Science', 'Social Studies', 'Computer Science'];
  genders: string[] = ['Male', 'Female', 'Other'];
  selectedDepartment: string = 'All Departments';
  sections: string[] = ['A', 'B', 'C']; // Add this to class
  selectedSection: string = 'All Sections';
  searchText: string = '';
  showModal: boolean = false;
  editMode: boolean = false;
  viewMode: boolean = false;

  formTeacher: Teacher = this.getEmptyTeacher();

  constructor(private dataService: FirebaseDataService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers() {
    this.dataService.getTeachers().subscribe((teachers: Teacher[]) => {
      this.teachers = teachers;
      this.filterTeachers();
    });
  }

  filterTeachers() {
    this.filteredTeachers = this.teachers.filter(t => {
      const matchesDept = this.selectedDepartment === 'All Departments' || t.department === this.selectedDepartment;
      const matchesSection = this.selectedSection === 'All Sections' || t.section === this.selectedSection;
      const matchesSearch = !this.searchText || 
        t.teacherId.includes(this.searchText) || 
        t.firstName.toLowerCase().includes(this.searchText.toLowerCase()) || 
        t.lastName.toLowerCase().includes(this.searchText.toLowerCase());

      return matchesDept && matchesSection && matchesSearch;
    });
  
  }

  openAddModal() {
    this.showModal = true;
    this.editMode = false;
    this.viewMode = false;
    this.formTeacher = this.getEmptyTeacher();
  }

  startEdit(teacher: Teacher) {
    this.showModal = true;
    this.editMode = true;
    this.viewMode = false;
    this.formTeacher = { ...teacher };
  }

  viewTeacher(teacher: Teacher) {
    this.showModal = true;
    this.viewMode = true;
    this.editMode = false;
    this.formTeacher = { ...teacher };
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
    this.viewMode = false;
    this.formTeacher = this.getEmptyTeacher();
  }

  saveTeacher() {
    if (!this.isFormValid()) return;

    const payload: Teacher = { ...this.formTeacher };

    if (this.editMode && payload.key) {
      this.dataService.updateTeacher(payload.key, payload).then(() => {
        this.loadTeachers();
        this.closeModal();
      });
    } else {
      this.dataService.addTeacher(payload).then(() => {
        this.loadTeachers();
        this.closeModal();
      });
    }
  }

  deleteTeacher(teacher: Teacher) {
    if (teacher.key && confirm('Are you sure you want to delete this teacher?')) {
      this.dataService.deleteTeacher(teacher.key).then(() => {
        this.loadTeachers();
      });
    }
  }

  isFormValid(): boolean {
    return this.formTeacher.firstName.trim() !== '' &&
           this.formTeacher.lastName.trim() !== '' &&
           this.formTeacher.gender !== '' &&
           this.formTeacher.department !== '' &&
           this.formTeacher.dob !== '' &&
           this.formTeacher.email.trim() !== '';
  }

  getEmptyTeacher(): Teacher {
    return {
      teacherId: '',
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      department: '',
      section: '',
      class: '',
      phone: '',
      email: '',
      address: ''
    };
  }
}
