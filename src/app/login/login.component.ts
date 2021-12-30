import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../common/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  loginForm: FormGroup | any;
  user: User = new User();
  errorMessage: any;
  successMessage: any;

  ngOnInit(): void {
    this.createform();
  }

  createform() {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.errorMessage = '';
    this.successMessage = '';
    this.user = this.loginForm.value as User;
    this.http
      .post<User>('http://localhost:8080/user/login', this.user)
      .subscribe(
        (loggedInUser) => {
          this.successMessage = 'Logged in Successfully..';
          this.user = loggedInUser;
          localStorage.setItem('user', this.user.emailId);
          this.router.navigate(['dashboard']);
        },
        (err) => {
          this.errorMessage = err.error;
        }
      );
  }
}
