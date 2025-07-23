import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
  console.log('Login button clicked:', this.email, this.password);
  this.error = '';
  this.userService.login(this.email, this.password)
    .then(() => {
      this.router.navigate(['/pages']); // safer redirect
    })
    .catch((err: any) => {
      this.error = err.message;
    });
}

}
