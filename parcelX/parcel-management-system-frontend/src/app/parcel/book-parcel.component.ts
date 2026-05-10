import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-book-parcel',
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

 <div class="form-container">
  <h1>Book a New Parcel</h1>

  <form (ngSubmit)="submitForm()" class="booking-form" autocomplete="off">
   <div class="form-main">

    <!-- PICKUP DETAILS -->
    <div class="form-section">
     <h3>Pickup Details</h3>
     <div class="form-group">
      <label>Sender Name <span class="req">*</span></label>
      <input type="text" [(ngModel)]="form.senderName" name="senderName"
        placeholder="Enter sender name" maxlength="40"
        (ngModelChange)="validateField('senderName')" required />
      <small class="field-error" *ngIf="errors.senderName">{{ errors.senderName }}</small>
     </div>
     <div class="form-group">
      <label>Pickup Address <span class="req">*</span></label>
      <input type="text" [(ngModel)]="form.pickupAddress" name="pickupAddress"
        placeholder="Enter pickup address" maxlength="100"
        (ngModelChange)="validateField('pickupAddress')" required />
      <small class="field-error" *ngIf="errors.pickupAddress">{{ errors.pickupAddress }}</small>
     </div>
     <div class="form-row">
      <div class="form-group">
       <label>PIN Code <span class="req">*</span></label>
       <input type="text" [(ngModel)]="form.pickupZipCode" name="pickupZipCode"
         placeholder="Enter pickup PIN code" maxlength="6" inputmode="numeric"
         (input)="limitDigits('pickupZipCode', 6); validateField('pickupZipCode')" required />
       <small class="field-error" *ngIf="errors.pickupZipCode">{{ errors.pickupZipCode }}</small>
      </div>
      <div class="form-group">
       <label>Contact Number <span class="req">*</span></label>
       <input type="tel" [(ngModel)]="form.pickupContactInfo" name="pickupContactInfo"
         placeholder="Enter pickup contact number" maxlength="10" inputmode="numeric"
         (input)="limitDigits('pickupContactInfo', 10); validateField('pickupContactInfo')" required />
       <small class="field-error" *ngIf="errors.pickupContactInfo">{{ errors.pickupContactInfo }}</small>
      </div>
     </div>
    </div>

    <!-- PACKAGE DETAILS -->
    <div class="form-section">
     <h3>Package Details</h3>
     <div class="form-row">
      <div class="form-group">
       <label>Weight (grams) <span class="req">*</span></label>
       <input type="text" [(ngModel)]="form.weight" name="weight"
         placeholder="Enter parcel weight" maxlength="5" inputmode="numeric"
         (input)="limitWeightDigits()" required />
       <small class="field-error" *ngIf="errors.weight">{{ errors.weight }}</small>
      </div>
      <div class="form-group">
       <label>Pickup Date <span class="req">*</span></label>
       <input type="date" [(ngModel)]="form.pickupDate" name="pickupDate"
         [min]="minPickupDate" [max]="maxPickupDate"
         (ngModelChange)="validateField('pickupDate')" required />
       <small class="field-error" *ngIf="errors.pickupDate">{{ errors.pickupDate }}</small>
      </div>
     </div>
     <div class="form-row">
      <div class="form-group">
       <label>Delivery Type</label>
       <select [(ngModel)]="form.deliveryType" name="deliveryType" (change)="calculateCost()">
        <option value="STANDARD">Standard Delivery — INR 30</option>
        <option value="EXPRESS">Express Delivery — INR 80</option>
        <option value="SAME_DAY">Same-Day Delivery — INR 150</option>
       </select>
      </div>
      <div class="form-group">
       <label>Packaging Type</label>
       <select [(ngModel)]="form.packagingType" name="packagingType" (change)="calculateCost()">
        <option value="BASIC">Basic Packing — INR 10</option>
        <option value="PREMIUM">Premium Packing — INR 30</option>
       </select>
      </div>
     </div>
    </div>

    <!-- DROP DETAILS -->
    <div class="form-section">
     <h3>Drop Details</h3>
     <div class="form-group">
      <label>Receiver Name <span class="req">*</span></label>
      <input type="text" [(ngModel)]="form.receiverName" name="receiverName"
        placeholder="Enter receiver name" maxlength="40"
        (ngModelChange)="validateField('receiverName')" required />
      <small class="field-error" *ngIf="errors.receiverName">{{ errors.receiverName }}</small>
     </div>
     <div class="form-group">
      <label>Drop Location <span class="req">*</span></label>
      <input type="text" [(ngModel)]="form.dropLocation" name="dropLocation"
        placeholder="Enter drop address" maxlength="100"
        (ngModelChange)="validateField('dropLocation')" required />
      <small class="field-error" *ngIf="errors.dropLocation">{{ errors.dropLocation }}</small>
     </div>
     <div class="form-row">
      <div class="form-group">
       <label>PIN Code <span class="req">*</span></label>
       <input type="text" [(ngModel)]="form.dropZipCode" name="dropZipCode"
         placeholder="Enter drop PIN code" maxlength="6" inputmode="numeric"
         (input)="limitDigits('dropZipCode', 6); validateField('dropZipCode')" required />
       <small class="field-error" *ngIf="errors.dropZipCode">{{ errors.dropZipCode }}</small>
      </div>
      <div class="form-group">
       <label>Contact Number <span class="req">*</span></label>
       <input type="tel" [(ngModel)]="form.dropContactInfo" name="dropContactInfo"
         placeholder="Enter drop contact number" maxlength="10" inputmode="numeric"
         (input)="limitDigits('dropContactInfo', 10); validateField('dropContactInfo')" required />
       <small class="field-error" *ngIf="errors.dropContactInfo">{{ errors.dropContactInfo }}</small>
      </div>
     </div>
    </div>

    <button type="submit" class="submit-btn" [disabled]="submitting">
     {{ submitting ? 'Booking...' : 'Proceed to Payment' }}
    </button>

   </div>

   <aside class="cost-display">
    <p>Estimated Cost</p>
    <strong>INR {{ estimatedCost }}</strong>
    <small>Base ₹50 + ₹0.02/g + delivery + packing + 5% tax</small>
   </aside>
  </form>
 </div>

 <!-- POPUP MODAL -->
 <div *ngIf="popupMessage" class="modal" (click)="closePopup()">
  <div class="modal-content small-popup" (click)="$event.stopPropagation()">
   <button class="close-btn" (click)="closePopup()">Close</button>
   <h2>{{ popupTitle }}</h2>
   <p>{{ popupMessage }}</p>
  </div>
 </div>

</div>
`,
 styles: [`
.page-wrapper { min-height: 100vh; background: #1f2937; }
.navbar { background: rgba(0,0,0,0.3); color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
.nav-brand { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.nav-actions { display: flex; gap: 10px; }
.home-btn, .back-btn { padding: 10px 20px; background: rgba(255,255,255,0.3); color: white; border: none; border-radius: 5px; cursor: pointer; transition: all 0.2s; }
.home-btn:hover, .back-btn:hover { background: rgba(255,255,255,0.45); }
.form-container { max-width: 980px; margin: 30px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.form-container h1 { margin-top: 0; color: #333; }
.booking-form { display: grid; grid-template-columns: minmax(0,1fr) 240px; gap: 24px; align-items: start; }
.form-main { min-width: 0; }
.form-section { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
.form-section:last-of-type { border-bottom: none; }
.form-section h3 { margin-top: 0; color: #334155; }
.form-group { margin-bottom: 15px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
.req { color: #dc2626; margin-left: 2px; }
.form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; color: #111827; background: white; }
.form-group input::placeholder { color: #64748b; }
.form-group input:focus, .form-group select:focus { outline: none; border-color: #334155; }
.cost-display { background: #f8fafc; color: #1f2937; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; position: sticky; top: 24px; }
.cost-display p { margin: 0; font-size: 18px; font-weight: 700; color: #334155; }
.cost-display strong { display: block; margin-top: 8px; font-size: 26px; color: #111827; }
.cost-display small { display: block; margin-top: 8px; color: #64748b; }
.submit-btn { width: 100%; padding: 15px; margin-top: 20px; background: #1f2937; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
.submit-btn:hover:not(:disabled) { background: #374151; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.field-error { display: block; color: #dc2626; margin-top: 5px; font-size: 12px; font-weight: bold; }
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; color: #1f2937; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.close-btn { position: absolute; top: 15px; right: 15px; background: #f1f5f9; border: 1px solid #d1d5db; border-radius: 5px; padding: 6px 10px; font-size: 12px; cursor: pointer; }
.small-popup { max-width: 360px; }
@media (max-width: 820px) {
  .form-container { margin: 20px; padding: 24px; }
  .booking-form { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .cost-display { position: static; order: -1; }
}
 `]
})
export class BookParcelComponent implements OnInit {

 form: any = {
  pickupAddress: '',
  pickupZipCode: '',
  pickupContactInfo: '',
  senderName: '',
  dropLocation: '',
  dropZipCode: '',
  dropContactInfo: '',
  receiverName: '',
  weight: '',
  deliveryType: 'STANDARD',
  packagingType: 'BASIC',
  pickupDate: ''
 };

 estimatedCost = 0;
 minPickupDate = '';
 maxPickupDate = '';
 errors: any = {};
 submitting = false;
 popupTitle = '';
 popupMessage = '';

 constructor(private router: Router, private http: HttpClient) {}

 ngOnInit() {
  const today = new Date();
  this.minPickupDate = today.toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  this.maxPickupDate = maxDate.toISOString().split('T')[0];
  this.calculateCost();
 }

 calculateCost() {
  const weight = Number(this.form.weight) || 0;
  const deliveryCharge = this.form.deliveryType === 'SAME_DAY' ? 150
   : this.form.deliveryType === 'EXPRESS' ? 80 : 30;
  const packagingCharge = this.form.packagingType === 'PREMIUM' ? 30 : 10;
  const subtotal = 50 + (0.02 * weight) + deliveryCharge + packagingCharge;
  this.estimatedCost = Math.round(subtotal * 1.05 * 100) / 100;
 }

 limitDigits(field: string, length: number) {
  this.form[field] = String(this.form[field] || '').replace(/\D/g, '').slice(0, length);
 }

 limitWeightDigits() {
  this.form.weight = String(this.form.weight || '').replace(/\D/g, '').slice(0, 5);
  this.calculateCost();
  this.validateField('weight');
 }

 validateField(field: string) {
  const value = this.form[field];
  delete this.errors[field];

  if (field === 'senderName' && !/^[A-Za-z ]{3,40}$/.test(value || ''))
   this.errors.senderName = 'Sender name must contain only letters (min 3 characters)';

  if (field === 'receiverName' && !/^[A-Za-z ]{3,40}$/.test(value || ''))
   this.errors.receiverName = 'Receiver name must contain only letters (min 3 characters)';

  if (field === 'pickupAddress' && (!value || value.trim().length < 10))
   this.errors.pickupAddress = 'Pickup address must be at least 10 characters';

  if (field === 'dropLocation' && (!value || value.trim().length < 10))
   this.errors.dropLocation = 'Drop address must be at least 10 characters';

  if (field === 'pickupZipCode' && !this.isValidZip(value))
   this.errors.pickupZipCode = 'Enter a valid 6-digit Indian PIN code';

  if (field === 'dropZipCode' && !this.isValidZip(value))
   this.errors.dropZipCode = 'Enter a valid 6-digit Indian PIN code';

  if (field === 'pickupContactInfo' && !/^[6-9]\d{9}$/.test(value || ''))
   this.errors.pickupContactInfo = 'Enter a valid 10-digit mobile number';

  if (field === 'dropContactInfo' && !/^[6-9]\d{9}$/.test(value || ''))
   this.errors.dropContactInfo = 'Enter a valid 10-digit mobile number';

  if (field === 'pickupDate' && !value)
   this.errors.pickupDate = 'Pickup date is required';

  if (field === 'weight') {
   const w = Number(value);
   if (!value || isNaN(w))        this.errors.weight = 'Weight is required';
   else if (w < 50)               this.errors.weight = 'Minimum parcel weight is 50 grams';
   else if (w > 30000)            this.errors.weight = 'Maximum parcel weight is 30,000 grams';
  }
 }

 validateForm(): boolean {
  this.errors = {};
  ['senderName','pickupAddress','pickupZipCode','pickupContactInfo',
   'receiverName','dropLocation','dropZipCode','dropContactInfo',
   'weight','pickupDate'].forEach(f => this.validateField(f));
  return Object.keys(this.errors).length === 0;
 }

 submitForm() {
  if (!this.validateForm() || this.submitting) return;
  this.submitting = true;

  const body = {
   pickupAddress:    this.form.pickupAddress.trim(),
   senderName:       this.form.senderName.trim(),
   pickupZipCode:    this.form.pickupZipCode,
   pickupContactInfo: this.form.pickupContactInfo,
   dropLocation:     this.form.dropLocation.trim(),
   receiverName:     this.form.receiverName.trim(),
   dropZipCode:      this.form.dropZipCode,
   dropContactInfo:  this.form.dropContactInfo,
   weight:           Number(this.form.weight),
   deliveryType:     this.form.deliveryType,
   packagingType:    this.form.packagingType,
   pickupDate:       this.form.pickupDate
  };

  this.http.post(`${environment.apiUrl}/parcels`, body).subscribe({
   next: (response: any) => {
    this.submitting = false;
    this.showPopup('Parcel Booked!', 'Your parcel has been booked successfully. Redirecting to payment...');
    setTimeout(() => {
     this.closePopup();
     this.router.navigate(['/payment', response.id], { state: { parcelData: response } });
    }, 1500);
   },
   error: (err: any) => {
    this.submitting = false;
    this.showPopup('Booking Failed', err.error?.message || err.error?.error || 'Failed to book parcel. Please try again.');
   }
  });
 }

 isValidZip(value: string) { return /^[1-9][0-9]{5}$/.test(value || ''); }
 showPopup(title: string, message: string) { this.popupTitle = title; this.popupMessage = message; }
 closePopup() { this.popupMessage = ''; }
 goBack() { this.router.navigate(['/user-dashboard']); }
 goHome() { this.router.navigate(['/']); }
}
