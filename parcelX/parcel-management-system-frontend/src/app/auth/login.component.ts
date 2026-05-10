import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-login',
 standalone: true,
 imports: [FormsModule, CommonModule],

 template: `
<div class="login-container">

  <div class="navbar">
    <div class="navbar-brand" (click)="goHome()" style="cursor:pointer">Parcel Management System</div>
  </div>

  <div class="login-content">

    <div class="login-card">

      <h2>Sign In</h2>
      <p class="subtitle">Enter your credentials to continue</p>

      <form (ngSubmit)="login()" autocomplete="off">

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            [(ngModel)]="username"
            name="username"
            placeholder="Enter your username"
            autocomplete="off"
          />
          <small class="error" *ngIf="errors.username">{{ errors.username }}</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-group">
            <input
              id="password"
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password"
              autocomplete="new-password"
              class="form-control"
            />
            <span class="input-group-text eye-icon" (click)="showPassword = !showPassword">
              <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
            </span>
          </div>
          <small class="error" *ngIf="errors.password">{{ errors.password }}</small>
        </div>

        <button type="submit" class="login-btn">Sign In</button>

      </form>

      <p class="register-link">
        Don't have an account?
        <a href="javascript:void(0)" (click)="goToRegister()">Sign Up</a>
      </p>
      <p class="register-link">
        <a href="javascript:void(0)" (click)="goHome()">← Back to Home</a>
      </p>

      <p *ngIf="successMessage" class="message success">{{ successMessage }}</p>
      <p *ngIf="errorMessage" class="message error">{{ errorMessage }}</p>

    </div>

  </div>

  <div class="footer">
    <p>&copy; 2026 Parcel Management System. All rights reserved.</p>
  </div>

</div>
`,

 styles: [`

.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1f2937;
}

.navbar {
  background: rgba(0,0,0,0.5);
  padding: 20px;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.login-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 400px;
}

.login-card h2 { margin-top: 0; margin-bottom: 10px; color: #333; }

.subtitle { color: #999; margin-bottom: 30px; font-size: 14px; }

.form-group { margin-bottom: 20px; }

label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #334155;
  box-shadow: 0 0 5px rgba(15,23,42,0.12);
}

.input-group { display: flex; align-items: stretch; }

.form-control {
  border-right: none !important;
  border-radius: 5px 0 0 5px !important;
}

.eye-icon {
  cursor: pointer;
  background: white;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 5px 5px 0;
  padding: 0 14px;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #475569;
  transition: all 0.2s;
}

.eye-icon:hover { background: #f8fafc; color: #111827; }

.error {
  display: block;
  color: #991b1b;
  font-size: 12px;
  margin-top: 3px;
  font-weight: bold;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.login-btn:hover { background: #374151; box-shadow: 0 5px 20px rgba(15,23,42,0.18); }

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.message.success { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
.message.error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.footer {
  background: rgba(0,0,0,0.5);
  color: white;
  text-align: center;
  padding: 20px;
}

.footer p { margin: 0; }

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #334155;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover { text-decoration: underline; }

`]
})

export class LoginComponent {

 username = '';
 password = '';
 showPassword = false;
 errors: any = {};
 successMessage = '';
 errorMessage = '';

 constructor(
  private http: HttpClient,
  private router: Router
 ) {}

 login() {

  this.successMessage = '';
  this.errorMessage = '';
  this.errors = {};

  if (!this.username.trim()) this.errors.username = 'Username is required';
  if (!this.password)        this.errors.password = 'Password is required';
  if (Object.keys(this.errors).length > 0) return;

  this.http.post(`${environment.apiUrl}/auth/login`, {
   username: this.username,
   password: this.password
  }).subscribe({

   next: (response: any) => {

    localStorage.setItem('authToken',  response.token);
    localStorage.setItem('username',   this.username);
    localStorage.setItem('userRole',   response.role);

    this.successMessage = 'Login successful. Redirecting...';

    setTimeout(() => {
     if (response.role === 'ADMIN') {
      this.router.navigate(['/admin-dashboard'], { state: { loginAcknowledgement: true } });
     } else {
      this.router.navigate(['/user-dashboard'], { state: { loginAcknowledgement: true } });
     }
    }, 800);
   },

   error: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    this.errorMessage = 'Invalid username or password. Please try again.';
   }
  });
 }

 goToRegister() { this.router.navigate(['/register']); }
 goHome()        { this.router.navigate(['/']); }
}
