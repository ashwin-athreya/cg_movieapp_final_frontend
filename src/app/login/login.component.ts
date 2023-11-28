import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { LogginService } from './loggin.service';
import { UsrService } from '../user/usr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading: boolean = true;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private lService: LogginService,
    private usrService: UsrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  userLogin(data: any) {
    console.warn(data);
    this.usrService.login(data);
  }

  doLogin() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    // Call userLogin function with the login data
    this.userLogin({ username, password });

    // Continue with the existing logic
    this.lService.login(username, password).subscribe(
      (res: any) => {
        if (res.user.role === 'ADMIN') {
          this.lService.setUserRole(true);
          console.log(this.lService.getUserRole());
        } else {
          this.lService.setUserRole(false);

          // If the user is a customer, store customerId in localStorage
          if (res.user.customer != null) {
            this.lService.setCustomerId(res.user.customer.customerId);
            localStorage.setItem('customerId', res.user.customer.customerId.toString());
          }
          const customerId = localStorage.getItem('customerId');

if (customerId) {
  // 'customerId' exists in localStorage, you can use its value
  console.log('customerId:', customerId);
} else {
  // 'customerId' does not exist in localStorage
  console.log('customerId not found in localStorage');
}
        }

        this.lService.setLoginStatus(res.loginStatus);
        this.router.navigate(['']);
      },
      (error: any) => {
        this.errorMessage = error;
      }
    );
  }
}
