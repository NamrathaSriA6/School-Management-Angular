import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { TeachersComponent } from './pages/teachers/teachers.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LoginComponent },

  {
    path: 'pages',
    component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'teachers', component: TeachersComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: '', redirectTo: 'teachers', pathMatch: 'full' } 
      // default inside /pages
    ]
  },

  { path: '**', redirectTo: '' } // fallback for unknown routes
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
