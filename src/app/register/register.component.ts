import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../common/models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  registerForm: FormGroup | any;
  user: User = new User();
  errorMessage: any;
  successMessage: any;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  register() {
    this.successMessage = '';
    this.errorMessage = '';
    this.user = this.registerForm.value as User;

    //Making post request to register
    this.http
      .post<User>('http://localhost:8080/user/register', this.user)
      .subscribe(
        (result) => {
          console.log('Registered Result: ', result);
          this.successMessage =
            'User ' + result.emailId + ' registered successfully';
          this.router.navigate(['dashboard'], {
            queryParams: { loggedInUser: result },
          });
        },
        (err) => {
          this.errorMessage = err.error;
        }
      );
  }
}
