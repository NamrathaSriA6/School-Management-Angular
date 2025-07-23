import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Teacher {
  teacherId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  department: string;
  class?: string;
  section?: string;
  phone: string;
  email: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {
  private teachersRef: AngularFireList<Teacher>;

  constructor(private db: AngularFireDatabase) {
    this.teachersRef = this.db.list<Teacher>('teachers');
  }

  addTeacher(teacher: Teacher) {
    return this.teachersRef.push(teacher);
  }

  getTeachers(): Observable<Teacher[]> {
  return this.teachersRef.snapshotChanges().pipe(
    map(changes =>
      changes.map(c => ({ key: c.payload.key, ...(c.payload.val() as Teacher) }))
    )
  );
}


  updateTeacher(key: string, teacher: Partial<Teacher>) {
    return this.teachersRef.update(key, teacher);
  }

  deleteTeacher(key: string) {
    return this.teachersRef.remove(key);
  }

  list(path: string) {
    return this.db.list(path);
  }
}
