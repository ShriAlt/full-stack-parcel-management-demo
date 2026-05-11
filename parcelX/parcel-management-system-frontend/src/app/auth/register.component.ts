import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-register',
 standalone: true,
 imports: [FormsModule, CommonModule],

 template: `

<div class="register-container">

  <div class="navbar">
    <div class="navbar-brand" (click)="goHome()" style="cursor:pointer">Parcel Management System</div>
  </div>

  <div class="register-content">

    <div class="register-card">

      <h2>Create Account</h2>
      <p class="subtitle">Join our parcel delivery network</p>

      <form (ngSubmit)="register()" autocomplete="off">

        <!-- NAME -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <input id="name" type="text" [(ngModel)]="formData.name" name="name"
            placeholder="Enter your full name" maxlength="50"
            (ngModelChange)="validateField('name')" required />
          <small class="error" *ngIf="errors.name">{{ errors.name }}</small>
        </div>

        <!-- EMAIL -->
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" [(ngModel)]="formData.email" name="email"
            placeholder="Enter your email address"
            (ngModelChange)="validateField('email')" required />
          <small class="error" *ngIf="errors.email">{{ errors.email }}</small>
        </div>

        <!-- PHONE -->
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input id="phone" type="tel" [(ngModel)]="formData.phone" name="phone"
            placeholder="Enter your mobile number" maxlength="10" inputmode="numeric"
            (input)="limitDigits('phone', 10); validateField('phone')" required />
          <small class="error" *ngIf="errors.phone">{{ errors.phone }}</small>
        </div>

        <!-- ADDRESS -->
        <div class="form-group">
          <label for="address">Address</label>
          <textarea id="address" [(ngModel)]="formData.address" name="address"
            placeholder="Enter your address" rows="3" maxlength="120"
            (ngModelChange)="validateField('address')" required></textarea>
          <small class="error" *ngIf="errors.address">{{ errors.address }}</small>
        </div>

        <!-- CITY -->
        <div class="form-group">
          <label for="city">City</label>
          <input id="city" type="text" [(ngModel)]="formData.city" name="city"
            placeholder="Enter your city" maxlength="50"
            (ngModelChange)="validateField('city')" required />
          <small class="error" *ngIf="errors.city">{{ errors.city }}</small>
        </div>

        <!-- STATE -->
        <div class="form-group">
          <label for="state">State</label>
          <input id="state" type="text" [(ngModel)]="formData.state" name="state"
            placeholder="Enter your state" maxlength="50"
            (ngModelChange)="validateField('state')" required />
          <small class="error" *ngIf="errors.state">{{ errors.state }}</small>
        </div>

        <!-- PIN CODE -->
        <div class="form-group">
          <label for="zipCode">PIN Code</label>
          <input id="zipCode" type="text" [(ngModel)]="formData.zipCode" name="zipCode"
            placeholder="Enter your PIN code" maxlength="6" inputmode="numeric"
            (input)="limitDigits('zipCode', 6); validateField('zipCode')" required />
          <small class="error" *ngIf="errors.zipCode">{{ errors.zipCode }}</small>
        </div>

        <!-- USERNAME -->
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" type="text" [(ngModel)]="formData.username" name="username"
            placeholder="Enter your username" maxlength="20"
            (ngModelChange)="validateField('username')" required />
          <small class="hint">3–20 characters, alphanumeric and underscore only</small>
          <small class="error" *ngIf="errors.username">{{ errors.username }}</small>
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-group">
            <input id="password" [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="formData.password" name="password"
              placeholder="Enter your password"
              (ngModelChange)="validateField('password'); validateField('confirmPassword')"
              required class="form-control" />
            <span class="input-group-text eye-icon" (click)="showPassword = !showPassword">
              <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
            </span>
          </div>
          <small class="hint">Min 8 chars with uppercase, lowercase &amp; special character</small>
          <small class="error" *ngIf="errors.password">{{ errors.password }}</small>
        </div>

        <!-- CONFIRM PASSWORD -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-group">
            <input id="confirmPassword" [type]="showConfirmPassword ? 'text' : 'password'"
              [(ngModel)]="formData.confirmPassword" name="confirmPassword"
              placeholder="Re-enter your password"
              (ngModelChange)="validateField('confirmPassword')"
              required class="form-control" />
            <span class="input-group-text eye-icon" (click)="showConfirmPassword = !showConfirmPassword">
              <i class="bi" [ngClass]="showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
            </span>
          </div>
          <small class="error" *ngIf="errors.confirmPassword">{{ errors.confirmPassword }}</small>
        </div>

        <div class="policy-group">
          <label class="policy-label" for="acceptPrivacyPolicy">
            <input id="acceptPrivacyPolicy" type="checkbox"
              [(ngModel)]="acceptedPrivacyPolicy" name="acceptedPrivacyPolicy"
              (ngModelChange)="validateField('acceptedPrivacyPolicy')" />
            <span>I accept the privacy policy and agree to the terms of service.</span>
          </label>
          <small class="error" *ngIf="errors.acceptedPrivacyPolicy">{{ errors.acceptedPrivacyPolicy }}</small>
        </div>

        <button type="submit" class="register-btn">Create Account</button>

      </form>

      <p class="login-link">
        Already have an account?
        <a href="javascript:void(0)" (click)="goToLogin()">Sign In</a>
      </p>
      <p class="login-link">
        <a href="javascript:void(0)" (click)="goHome()">← Back to Home</a>
      </p>

      <p *ngIf="successMessage" class="message success">{{ successMessage }}</p>
      <p *ngIf="errorMessage"   class="message error">{{ errorMessage }}</p>

    </div>

  </div>

  <div class="footer">
    <p>&copy; 2026 Parcel Management System. All rights reserved.</p>
  </div>

  <div *ngIf="acknowledgementMessage" class="modal" (click)="closeAcknowledgement()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <button class="close-btn" type="button" (click)="closeAcknowledgement()">Close</button>
      <h2>Registration successful</h2>
      <p>{{ acknowledgementMessage }}</p>
    </div>
  </div>

</div>
`,

 styles: [`

.register-container {
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

.register-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.register-card h2 { margin-top: 0; margin-bottom: 10px; color: #333; }
.subtitle { color: #999; margin-bottom: 30px; font-size: 14px; }
.form-group { margin-bottom: 20px; }

label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea { resize: vertical; }

input:focus, textarea:focus {
  outline: none;
  border-color: #334155;
  box-shadow: 0 0 5px rgba(15,23,42,0.12);
}

.hint { display: block; color: #999; font-size: 12px; margin-top: 3px; }
.error { display: block; color: #991b1b; font-size: 12px; margin-top: 3px; font-weight: bold; }

.input-group { display: flex; align-items: stretch; }
.form-control { border-right: none !important; border-radius: 5px 0 0 5px !important; }
.policy-group { margin-bottom: 20px; }
.policy-label { display: flex; align-items: flex-start; gap: 10px; font-weight: normal; line-height: 1.45; color: #334155; }
.policy-label input { width: 16px; height: 16px; margin-top: 3px; flex: 0 0 auto; }
.policy-label span { flex: 1; }

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

.eye-icon:hover { background: #f8fafc; color: #111827; }

.register-btn {
  width: 100%;
  padding: 12px;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.register-btn:hover { background: #374151; box-shadow: 0 5px 20px rgba(15,23,42,0.18); }

.login-link { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }

.login-link a { color: #334155; text-decoration: none; font-weight: bold; }
.login-link a:hover { text-decoration: underline; }

.message { margin-top: 15px; padding: 10px; border-radius: 5px; text-align: center; }
.message.success { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
.message.error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.footer { background: rgba(0,0,0,0.5); color: white; text-align: center; padding: 20px; }
.footer p { margin: 0; }
.modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal-content{background:white;color:#1f2937;padding:30px;border-radius:10px;max-width:380px;width:90%;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.3);text-align:center}
.close-btn{position:absolute;top:15px;right:15px;background:#f1f5f9;border:1px solid #d1d5db;font-size:12px;cursor:pointer}

`]
})

export class RegisterComponent {

 formData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  username: '',
  password: '',
  confirmPassword: ''
 };

 errors: any = {};
 acceptedPrivacyPolicy = false;
 showPassword = false;
 showConfirmPassword = false;
 successMessage = '';
 errorMessage = '';
 acknowledgementMessage = '';

 constructor(
  private http: HttpClient,
  private router: Router
 ) {}

 // ─── VALIDATION ────────────────────────────────────────────────────────────

 validateForm(): boolean {

  this.errors = {};

  // FULL NAME
  const name = this.formData.name.trim().replace(/\s+/g, ' ');
  if (!name) {
   this.errors.name = 'Full name is required';
  } else if (name.length < 3) {
   this.errors.name = 'Full name must contain at least 3 characters';
  } else if (!/^[A-Za-z ]+$/.test(name)) {
   this.errors.name = 'Full name can contain only letters and spaces';
  }

  // EMAIL — standard pattern (no restriction on digit-starting local parts)
  const email = this.formData.email.trim();
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!email) {
   this.errors.email = 'Email is required';
  } else if (!emailPattern.test(email)) {
   this.errors.email = 'Please enter a valid email address (e.g. name@example.com)';
  }

  // PHONE
  if (!/^[6-9]\d{9}$/.test(this.formData.phone)) {
   this.errors.phone = 'Phone must be a valid 10-digit number starting with 6–9';
  }

  const address = this.formData.address.trim().replace(/\s+/g, ' ');
  if (!address) {
   this.errors.address = 'Address is required';
  } else if (address.length < 10) {
   this.errors.address = 'Address must contain at least 10 characters';
  }

  const city = this.formData.city.trim().replace(/\s+/g, ' ');
  if (!city) {
   this.errors.city = 'City is required';
  } else if (city.length < 3) {
   this.errors.city = 'City name must contain at least 3 characters';
  } else if (!/^[A-Za-z ]+$/.test(city)) {
   this.errors.city = 'City can contain only letters and spaces';
  }

  const state = this.formData.state.trim().replace(/\s+/g, ' ');
  if (!state) {
   this.errors.state = 'State is required';
  } else if (state.length < 3) {
   this.errors.state = 'State name must contain at least 3 characters';
  } else if (!/^[A-Za-z ]+$/.test(state)) {
   this.errors.state = 'State can contain only letters and spaces';
  }

  if (!/^[1-9][0-9]{5}$/.test(this.formData.zipCode)) {
   this.errors.zipCode = 'PIN code must be a valid 6-digit Indian PIN (cannot start with 0)';
  }

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(this.formData.username)) {
   this.errors.username = 'Username must be 3–20 characters (letters, numbers, underscore)';
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;
  if (!passwordPattern.test(this.formData.password)) {
   this.errors.password = 'Password must be at least 8 characters with uppercase, lowercase and a special character';
  }

  if (this.formData.password !== this.formData.confirmPassword) {
   this.errors.confirmPassword = 'Passwords do not match';
  }

  if (!this.acceptedPrivacyPolicy) {
   this.errors.acceptedPrivacyPolicy = 'Please accept the privacy policy to create an account';
  }

  return Object.keys(this.errors).length === 0;
 }

 register(): void {

  this.successMessage = '';
  this.errorMessage = '';

  if (!this.validateForm()) return;

  const payload = {
   username:  this.formData.username,
   password:  this.formData.password,
   email:     this.formData.email.trim(),
   name:      this.formData.name.trim().replace(/\s+/g, ' '),
   phone:     this.formData.phone,
   address:   this.formData.address.trim(),
   city:      this.formData.city.trim().replace(/\s+/g, ' '),
   state:     this.formData.state.trim().replace(/\s+/g, ' '),
   zipCode:   this.formData.zipCode,
   role:      'CUSTOMER'
  };

  this.http.post(`${environment.apiUrl}/auth/register`, payload).subscribe({

   next: () => {
    this.successMessage = 'Account created successfully! Redirecting to login...';
    this.acknowledgementMessage = 'Your account has been created successfully. Redirecting to login...';
    setTimeout(() => this.router.navigate(['/login']), 1800);
   },

   error: (error: any) => {
    const raw: string = (
     error.error?.message ||
     error.error?.error  ||
     ''
    ).toLowerCase();

    if (raw.includes('email') && (raw.includes('exist') || raw.includes('duplicate') || raw.includes('taken'))) {
     this.errorMessage = 'This email address is already registered. Please use a different email or sign in.';
    } else if (raw.includes('phone') && (raw.includes('exist') || raw.includes('duplicate') || raw.includes('taken'))) {
     this.errorMessage = 'This phone number is already registered. Please use a different phone number.';
    } else if (raw.includes('username') && (raw.includes('exist') || raw.includes('duplicate') || raw.includes('taken'))) {
     this.errorMessage = 'This username is already taken. Please choose a different username.';
    } else if (error.status === 409) {
     this.errorMessage = 'An account with this email, phone, or username already exists.';
    } else {
     this.errorMessage = error.error?.message || error.error?.error || 'Registration failed. Please check your details and try again.';
    }
   }
  });
 }

 goToLogin() { this.router.navigate(['/login']); }
 goHome()    { this.router.navigate(['/']); }
 closeAcknowledgement() {
  this.acknowledgementMessage = '';
  this.router.navigate(['/login']);
 }

 limitDigits(field: keyof typeof this.formData, length: number): void {
  this.formData[field] = String(this.formData[field] || '').replace(/\D/g, '').slice(0, length);
 }

 validateField(field: string): void {
  const previous = { ...this.errors };
  this.validateForm();
  Object.keys(this.errors).forEach(key => {
   if (key !== field && !previous[key]) delete this.errors[key];
  });
 }
}
