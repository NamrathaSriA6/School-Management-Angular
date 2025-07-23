import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private db: AngularFireDatabase) {}

  getCurrentDate(): Observable<any> {
    return this.db.object('currentDate').valueChanges();
  }

  submitAttendance(
    teacherId: string,
    date: string,
    status: 'present' | 'absent'
  ): Promise<void> {
    return this.db.object(`attendance/${date}/${teacherId}`).set({ status });
  }

  getAttendanceForDate(date: string): Observable<any> {
    return this.db.object(`attendance/${date}`).valueChanges();
  }

  getSubmittedDates(): Observable<any> {
    return this.db.object('submittedDates').valueChanges();
  }

  markDateSubmitted(date: string): Promise<void> {
    return this.db.object(`submittedDates/${date}`).set(true);
  }
}