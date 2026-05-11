import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-forgot-password',
 standalone: true,
 imports: [CommonModule, FormsModule],
 template: `
<div class="reset-container">

  <div class="navbar">
    <div class="navbar-brand" (click)="goHome()" style="cursor:pointer">Parcel Management System</div>
  </div>

  <div class="reset-content">
    <div class="reset-card">
      <h2>Reset Password</h2>
      <p class="subtitle">{{ subtitle }}</p>

      <form *ngIf="!otpSent" (ngSubmit)="sendOtp()" autocomplete="off">
        <div class="form-group">
          <label for="email">Registered Email</label>
          <input
            id="email"
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="Enter your registered email"
            autocomplete="email"
          />
          <small class="error" *ngIf="errors.email">{{ errors.email }}</small>
        </div>

        <button type="submit" class="primary-btn" [disabled]="loading">
          {{ loading ? 'Sending OTP...' : 'Send OTP' }}
        </button>
      </form>

      <div *ngIf="otpSent && !otpVerified" class="email-summary">
        <span>{{ email }}</span>
        <button type="button" (click)="changeEmail()" [disabled]="loading">Change</button>
      </div>

      <form *ngIf="otpSent && !otpVerified" (ngSubmit)="verifyOtp()" autocomplete="off">
        <div class="form-group">
          <label for="otp">OTP</label>
          <input
            id="otp"
            type="text"
            [(ngModel)]="otp"
            name="otp"
            placeholder="Enter 6 digit OTP"
            maxlength="6"
            inputmode="numeric"
            autocomplete="one-time-code"
          />
          <small class="error" *ngIf="errors.otp">{{ errors.otp }}</small>
        </div>

        <button type="submit" class="primary-btn" [disabled]="loading">
          {{ loading ? 'Verifying...' : 'Verify OTP' }}
        </button>
        <button type="button" class="secondary-btn" (click)="sendOtp()" [disabled]="loading">
          Resend OTP
        </button>
      </form>

      <form *ngIf="otpVerified" (ngSubmit)="resetPassword()" autocomplete="off">
        <div class="email-summary">
          <span>{{ email }}</span>
          <span class="verified-label">OTP verified</span>
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <div class="input-group">
            <input
              id="newPassword"
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="newPassword"
              name="newPassword"
              placeholder="Create a new password"
              autocomplete="new-password"
              class="form-control"
            />
            <span class="input-group-text eye-icon" (click)="showPassword = !showPassword">
              <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
            </span>
          </div>
          <small class="error" *ngIf="errors.newPassword">{{ errors.newPassword }}</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your new password"
            autocomplete="new-password"
          />
          <small class="error" *ngIf="errors.confirmPassword">{{ errors.confirmPassword }}</small>
        </div>

        <button type="submit" class="primary-btn" [disabled]="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
        <button type="button" class="secondary-btn" (click)="sendOtp()" [disabled]="loading">
          Resend OTP
        </button>
      </form>

      <p class="register-link">
        Remembered your password?
        <a href="javascript:void(0)" (click)="goToLogin()">Sign In</a>
      </p>
      <p class="register-link">
        <a href="javascript:void(0)" (click)="goHome()">Back to Home</a>
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
.reset-container {
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
}

.reset-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.reset-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 430px;
}

.reset-card h2 { margin-top: 0; margin-bottom: 10px; color: #333; }
.subtitle { color: #777; margin-bottom: 30px; font-size: 14px; line-height: 1.5; }
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
}

.email-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  color: #334155;
  font-size: 14px;
}

.email-summary span {
  overflow-wrap: anywhere;
}

.email-summary button {
  border: none;
  background: transparent;
  color: #1f2937;
  font-weight: 700;
  cursor: pointer;
}

.verified-label {
  color: #166534;
  font-weight: 700;
  white-space: nowrap;
}

.error {
  display: block;
  color: #991b1b;
  font-size: 12px;
  margin-top: 3px;
  font-weight: bold;
}

.primary-btn,
.secondary-btn {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
}

.primary-btn {
  background: #1f2937;
  color: white;
  border: none;
}

.primary-btn:hover:not(:disabled) { background: #374151; box-shadow: 0 5px 20px rgba(15,23,42,0.18); }

.secondary-btn {
  margin-top: 10px;
  background: white;
  color: #1f2937;
  border: 1px solid #cbd5e1;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  line-height: 1.4;
}

.message.success { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
.message.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

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

.footer {
  background: rgba(0,0,0,0.5);
  color: white;
  text-align: center;
  padding: 20px;
}

.footer p { margin: 0; }
`]
})
export class ForgotPasswordComponent {
 email = '';
 otp = '';
 newPassword = '';
 confirmPassword = '';
 showPassword = false;
 otpSent = false;
 otpVerified = false;
 loading = false;
 errors: any = {};
 successMessage = '';
 errorMessage = '';

 constructor(
  private http: HttpClient,
  private router: Router
 ) {}

 get subtitle() {
  if (!this.otpSent) return 'Enter your registered email to receive an OTP';
  if (!this.otpVerified) return 'Enter and verify the OTP sent to your email';
  return 'Create a new password for your account';
 }

 sendOtp() {
  this.successMessage = '';
  this.errorMessage = '';
  this.errors = {};

  if (!this.isValidEmail(this.email)) {
   this.errors.email = 'Enter a valid registered email';
   return;
  }

  this.loading = true;
  this.http.post(`${environment.apiUrl}/auth/forgot-password`, {
   email: this.email.trim()
  }).subscribe({
   next: () => {
    this.otpSent = true;
    this.otpVerified = false;
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.successMessage = 'OTP sent to your registered email. It is valid for 10 minutes.';
    this.loading = false;
   },
   error: (error) => {
    this.errorMessage = error?.error?.message || 'Unable to send OTP. Please try again.';
    this.loading = false;
   }
  });
 }

 verifyOtp() {
  this.successMessage = '';
  this.errorMessage = '';
  this.errors = {};

  const normalizedOtp = this.otp.trim();
  if (!/^[0-9]{6}$/.test(normalizedOtp)) {
   this.errors.otp = 'Enter the 6 digit OTP';
   return;
  }

  this.loading = true;
  this.http.post(`${environment.apiUrl}/auth/verify-reset-otp`, {
   email: this.email.trim(),
   otp: normalizedOtp
  }).subscribe({
   next: () => {
    this.otpVerified = true;
    this.successMessage = 'OTP verified. Create your new password.';
   this.loading = false;
   },
   error: (error) => {
    this.errorMessage = this.getOtpErrorMessage(error);
    this.loading = false;
   }
  });
 }

 resetPassword() {
  this.successMessage = '';
  this.errorMessage = '';
  this.errors = {};

  if (!this.otpVerified) this.errors.otp = 'Verify the OTP before creating a new password';
  if (!this.isValidPassword(this.newPassword)) {
   this.errors.newPassword = 'Use 8+ chars with uppercase, lowercase, and special character';
  }
  if (this.newPassword !== this.confirmPassword) {
   this.errors.confirmPassword = 'Passwords do not match';
  }
  if (Object.keys(this.errors).length > 0) return;

  this.loading = true;
  this.http.post(`${environment.apiUrl}/auth/reset-password`, {
   email: this.email.trim(),
   otp: this.otp.trim(),
   newPassword: this.newPassword
  }).subscribe({
   next: () => {
    this.successMessage = 'Password reset successful. Redirecting to sign in...';
    this.loading = false;
    setTimeout(() => this.router.navigate(['/login']), 1000);
   },
   error: (error) => {
    this.errorMessage = error?.error?.message || 'Unable to reset password. Please check the OTP and try again.';
    this.loading = false;
   }
  });
 }

 changeEmail() {
  this.otpSent = false;
  this.otpVerified = false;
  this.otp = '';
  this.newPassword = '';
  this.confirmPassword = '';
  this.errors = {};
  this.successMessage = '';
  this.errorMessage = '';
 }

 goToLogin() { this.router.navigate(['/login']); }
 goHome() { this.router.navigate(['/']); }

 private isValidEmail(email: string) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());
 }

 private isValidPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/.test(password);
 }

 private getOtpErrorMessage(error: any) {
  if (error?.status === 404) {
   return 'OTP verification is not available yet. Please restart the backend and try again.';
  }
  return error?.error?.message || 'Invalid OTP. Please try again.';
 }
}
