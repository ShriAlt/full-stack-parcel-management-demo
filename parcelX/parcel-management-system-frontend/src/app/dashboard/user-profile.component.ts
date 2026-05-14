import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-user-profile',
 standalone: true,
 imports: [FormsModule, CommonModule],

 template: `

<div class="page-wrapper">

  <div class="navbar">
    <div class="nav-brand">Parcel Management System</div>
    <div class="nav-actions">
      <button class="home-btn" (click)="goHome()">Home</button>
      <button class="back-btn" (click)="goBack()">Back</button>
    </div>
  </div>

  <div class="main-content">

    <div class="profile-card" *ngIf="profile; else loading">

      <h1>My Profile</h1>

      <form (ngSubmit)="updateProfile()" class="profile-form" autocomplete="off">

        <!-- BASIC INFORMATION -->
        <div class="form-section">
          <h3>Basic Information</h3>

          <div class="form-group">
            <label>Username</label>
            <input type="text" [value]="profile.username" disabled class="disabled" />
          </div>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [value]="profile.name || ''" disabled class="disabled"
              placeholder="Enter your username" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="profile.email" name="email"
              placeholder="Enter your email address"
              (ngModelChange)="validateProfileField('email')" />
            <small class="error" *ngIf="errors.email">{{ errors.email }}</small>
          </div>

        </div>

        <!-- CONTACT INFORMATION -->
        <div class="form-section">
          <h3>Contact Information</h3>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" [(ngModel)]="profile.phone" name="phone"
              placeholder="Enter your mobile number" maxlength="10" inputmode="numeric"
              (input)="limitDigits('phone', 10); validateProfileField('phone')" />
            <small class="error" *ngIf="errors.phone">{{ errors.phone }}</small>
          </div>

          <div class="form-group">
            <label>Address</label>
            <textarea [(ngModel)]="profile.address" name="address"
              placeholder="Enter your address" maxlength="120" rows="3"
              (ngModelChange)="validateProfileField('address')"></textarea>
            <small class="error" *ngIf="errors.address">{{ errors.address }}</small>
          </div>

          <div class="form-row">

            <div class="form-group">
              <label>City</label>
              <input type="text" [(ngModel)]="profile.city" name="city"
                placeholder="Enter your city" maxlength="50"
                (ngModelChange)="validateProfileField('city')" />
              <small class="error" *ngIf="errors.city">{{ errors.city }}</small>
            </div>

            <div class="form-group">
              <label>State</label>
              <input type="text" [(ngModel)]="profile.state" name="state"
                placeholder="Enter your state" maxlength="50"
                (ngModelChange)="validateProfileField('state')" />
              <small class="error" *ngIf="errors.state">{{ errors.state }}</small>
            </div>

            <div class="form-group">
              <label>PIN Code</label>
              <input type="text" [(ngModel)]="profile.zipCode" name="zipCode"
                placeholder="Enter your PIN code" maxlength="6" inputmode="numeric"
                (input)="limitDigits('zipCode', 6); validateProfileField('zipCode')" />
              <small class="error" *ngIf="errors.zipCode">{{ errors.zipCode }}</small>
            </div>

          </div>

        </div>

        <button type="submit" class="submit-btn">Save Changes</button>

      </form>

      <p *ngIf="successMessage" class="message success">{{ successMessage }}</p>
      <p *ngIf="errorMessage"   class="message error">{{ errorMessage }}</p>

    </div>

    <ng-template #loading>
      <div class="loading-card">
        <p *ngIf="loadError" class="error-state">{{ loadError }}</p>
        <p *ngIf="!loadError">Loading profile...</p>
      </div>
    </ng-template>

  </div>

</div>
`,

 styles: [`

.page-wrapper { min-height: 100vh; background: #1f2937; }

.navbar {
  background: rgba(0,0,0,0.3);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }

.nav-actions { display: flex; gap: 10px; }

.home-btn, .back-btn {
  padding: 10px 20px;
  background: rgba(255,255,255,0.3);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.home-btn:hover, .back-btn:hover { background: rgba(255,255,255,0.45); }

.main-content { max-width: 700px; margin: 30px auto; padding: 20px; }

.profile-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.loading-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  color: #6b7280;
}

.profile-card h1 { margin-top: 0; color: #333; }

.form-section { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.form-section:last-of-type { border-bottom: none; }
.form-section h3 { margin-top: 0; color: #334155; }

.form-group { margin-bottom: 15px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }

.form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 14px;
}

.form-group textarea { resize: vertical; }

.form-group input.disabled { background: #f5f5f5; cursor: not-allowed; color: #6b7280; }

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #334155;
  box-shadow: 0 0 5px rgba(15,23,42,0.12);
}

.error { display: block; color: #991b1b; font-size: 12px; margin-top: 3px; font-weight: bold; }
.error-state { color: #991b1b; }

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover { background: #374151; box-shadow: 0 5px 20px rgba(15,23,42,0.18); }

.message { margin-top: 20px; padding: 15px; border-radius: 5px; text-align: center; }
.message.success { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
.message.error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .profile-card { padding: 24px; }
}

`]
})

export class UserProfileComponent implements OnInit {

 profile: any = null;
 errors: any = {};
 successMessage = '';
 errorMessage = '';
 loadError = '';

 constructor(
  private router: Router,
  private http: HttpClient
 ) {}

 ngOnInit() { this.loadProfile(); }

 loadProfile() {
  this.http.get(`${environment.apiUrl}/users/profile`).subscribe({
   next: (data: any) => {
    this.profile = {
     username: data.username || '',
     name:     data.name     || '',
     email:    data.email    || '',
     phone:    data.phone    || '',
     address:  data.address  || '',
     city:     data.city     || '',
     state:    data.state    || '',
     zipCode:  data.zipCode  || data.zip_code || data.pinCode || ''
    };
   },
   error: () => { this.loadError = 'Failed to load profile. Please refresh the page.'; }
  });
 }

 validate(): boolean {
  this.errors = {};

  const email = String(this.profile.email || '').trim();
  const emailPattern = /^(?!.*\.\.)(?![0-9]+@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
  if (!email)                      this.errors.email = 'Email is required';
  else if (!emailPattern.test(email)) this.errors.email = 'Enter a valid email such as name@example.com';

  const phone = String(this.profile.phone || '').trim();
  if (!phone)                         this.errors.phone = 'Phone number is required';
  else if (!/^[6-9]\d{9}$/.test(phone)) this.errors.phone = 'Phone must be a valid 10-digit number starting with 6–9';

  const address = String(this.profile.address || '').trim().replace(/\s+/g, ' ');
  if (!address)             this.errors.address = 'Address is required';
  else if (address.length < 10) this.errors.address = 'Address must contain at least 10 characters';

  // CITY — FIX: < 3, not <= 3
  const city = String(this.profile.city || '');
  if (!city)                        this.errors.city = 'City is required';
  else if (!/^(?=.{3,50}$)[A-Za-z]+(?: [A-Za-z]+)*$/.test(city)) this.errors.city = 'City must be 3-50 letters with single spaces only';

  // STATE — FIX: < 3
  const state = String(this.profile.state || '');
  if (!state)                         this.errors.state = 'State is required';
  else if (!/^(?=.{3,50}$)[A-Za-z]+(?: [A-Za-z]+)*$/.test(state)) this.errors.state = 'State must be 3-50 letters with single spaces only';

  const zipCode = String(this.profile.zipCode || '').trim();
  if (!zipCode)                           this.errors.zipCode = 'PIN code is required';
  else if (!/^[1-9][0-9]{5}$/.test(zipCode)) this.errors.zipCode = 'PIN code must be a valid 6-digit Indian PIN (cannot start with 0)';

  return Object.keys(this.errors).length === 0;
 }

 updateProfile() {
  this.successMessage = '';
  this.errorMessage   = '';

  if (!this.validate()) return;

  const payload = {
   email:   String(this.profile.email   || '').trim(),
   phone:   String(this.profile.phone   || '').trim(),
   address: String(this.profile.address || '').trim(),
   city:    String(this.profile.city    || '').trim().replace(/\s+/g, ' '),
   state:   String(this.profile.state   || '').trim().replace(/\s+/g, ' '),
   zipCode: String(this.profile.zipCode || '').trim()
  };

  this.http.put(`${environment.apiUrl}/users/profile`, payload).subscribe({
   next: () => {
    this.successMessage = 'Profile updated successfully!';
    setTimeout(() => this.successMessage = '', 4000);
   },
   error: (err: any) => {
    this.errorMessage = err.error?.message || err.error?.error || 'Failed to update profile.';
   }
  });
 }

 validateProfileField(field: string) {
  const prev = { ...this.errors };
  this.validate();
  Object.keys(this.errors).forEach(k => {
   if (k !== field && !prev[k]) delete this.errors[k];
  });
 }

 limitDigits(field: string, length: number) {
  if (!this.profile) return;
  this.profile[field] = String(this.profile[field] || '').replace(/\D/g, '').slice(0, length);
 }

 goBack() { this.router.navigate(['/user-dashboard']); }
 goHome() { this.router.navigate(['/']); }
}
