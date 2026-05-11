import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-payment',
 standalone: true,
 imports: [CommonModule, FormsModule],
 template: `
<div class="payment-page">
 <div class="topbar">
  <div class="brand">Parcel Management System Payments</div>
  <div class="topbar-actions">
   <button class="back-btn" (click)="goDashboard()">Dashboard</button>
   <button class="back-btn" (click)="goOrders()">My Orders</button>
  </div>
 </div>

 <div class="payment-wrapper">
  <div class="payment-card">
   <h2>Complete Payment</h2>
   <div class="summary-box" *ngIf="parcelData">
    <div class="summary-item"><span>Tracking ID</span><strong>{{ parcelData.trackingId || ('#' + parcelId) }}</strong></div>
    <div class="summary-item"><span>Amount</span><strong>INR {{ estimatedAmount }}</strong></div>
   </div>

   <div class="form-group">
    <label>Payment Method</label>
    <select [(ngModel)]="method" (ngModelChange)="clearPaymentFields()">
     <option value="UPI">UPI</option>
     <option value="CREDIT_CARD">Credit Card</option>
     <option value="DEBIT_CARD">Debit Card</option>
    </select>
   </div>

   <ng-container *ngIf="method === 'UPI'">
    <div class="form-group">
     <label>UPI ID</label>
     <input type="text" [(ngModel)]="upiId" placeholder="Enter your UPI ID" (ngModelChange)="validateField('upiId')" />
     <small class="field-error" *ngIf="errors.upiId">{{ errors.upiId }}</small>
    </div>
   </ng-container>

   <ng-container *ngIf="method !== 'UPI'">
    <div class="form-group">
     <label>Cardholder Name</label>
     <input type="text" [(ngModel)]="cardholderName" placeholder="Enter cardholder name" maxlength="50" (ngModelChange)="validateField('cardholderName')" />
     <small class="field-error" *ngIf="errors.cardholderName">{{ errors.cardholderName }}</small>
    </div>
    <div class="form-group">
     <label>Card Number</label>
     <input type="text" [(ngModel)]="cardNumber" placeholder="Enter card number" maxlength="16" inputmode="numeric" (input)="limitCardNumber(); validateField('cardNumber')" />
     <small class="field-error" *ngIf="errors.cardNumber">{{ errors.cardNumber }}</small>
    </div>
    <div class="form-row">
     <div class="form-group">
      <label>Expiry</label>
      <input type="text" [(ngModel)]="expiryDate" maxlength="5" placeholder="Enter expiry date" (input)="formatExpiryDate(); validateField('expiryDate')" />
      <small class="field-error" *ngIf="errors.expiryDate">{{ errors.expiryDate }}</small>
     </div>
     <div class="form-group">
      <label>CVV</label>
      <div class="cvv-wrapper">
       <input [type]="showCvv ? 'text' : 'password'" [(ngModel)]="cvv" maxlength="3" placeholder="Enter CVV" inputmode="numeric" (input)="limitCvv(); validateField('cvv')" />
       <button type="button" class="eye-btn" [attr.aria-label]="showCvv ? 'Hide CVV' : 'Show CVV'" [attr.title]="showCvv ? 'Hide CVV' : 'Show CVV'" (click)="showCvv = !showCvv">
        <i class="bi" [ngClass]="showCvv ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
       </button>
      </div>
      <small class="field-error" *ngIf="errors.cvv">{{ errors.cvv }}</small>
     </div>
    </div>
   </ng-container>

   <button class="pay-btn" (click)="submitPayment()" [disabled]="submitting">{{ submitting ? 'Processing...' : 'Pay Now' }}</button>
  </div>
 </div>

 <div *ngIf="popupMessage" class="modal" (click)="closePopup()">
  <div class="modal-content small-popup" (click)="$event.stopPropagation()">
   <button class="close-btn" (click)="closePopup()">Close</button>
   <h2>{{ popupTitle }}</h2>
   <p>{{ popupMessage }}</p>
  </div>
 </div>
</div>`,
 styles: [`
.payment-page{min-height:100vh;background:#1f2937}.topbar{background:rgba(0,0,0,.3);color:white;padding:15px 30px;display:flex;justify-content:space-between;align-items:center}.brand{font-size:24px;font-weight:bold}.topbar-actions{display:flex;gap:10px}.back-btn{padding:10px 20px;border:none;border-radius:5px;background:rgba(255,255,255,.3);color:white;cursor:pointer}.payment-wrapper{max-width:700px;margin:40px auto}.payment-card{background:white;padding:40px;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.3)}.payment-card h2{margin-top:0;color:#111827}.summary-box{background:#f8fafc;padding:20px;border:1px solid #e2e8f0;border-radius:8px;margin:20px 0}.summary-item{display:flex;justify-content:space-between;margin-bottom:10px;color:#1f2937}.form-group{margin-bottom:20px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:20px}label{display:block;margin-bottom:6px;font-weight:bold;color:#333}input,select{width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;color:#111827;background:white}input::placeholder{color:#64748b;opacity:1}.cvv-wrapper{position:relative}.eye-btn{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:34px;height:30px;border:1px solid #d1d5db;background:#f8fafc;color:#334155;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}.eye-btn:hover{background:#eef2f7;color:#111827}.pay-btn{width:100%;padding:14px;border:none;border-radius:6px;background:#1f2937;color:white;font-weight:bold;cursor:pointer}.pay-btn:disabled{opacity:.6;cursor:not-allowed}.field-error{display:block;color:#dc2626;margin-top:5px;font-size:12px;font-weight:bold}.modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}.modal-content{background:white;color:#1f2937;padding:30px;border-radius:10px;max-width:500px;width:90%;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.3)}.close-btn{position:absolute;top:15px;right:15px;background:#f1f5f9;border:1px solid #d1d5db;font-size:12px;cursor:pointer}.small-popup{max-width:360px}@media(max-width:768px){.payment-wrapper{margin:20px}.payment-card{padding:24px}.form-row{grid-template-columns:1fr}.topbar{display:block}.topbar-actions{margin-top:12px}}
 `]
})
export class PaymentComponent implements OnInit {
 parcelData: any = null;
 parcelId: number | null = null;
 estimatedAmount = 0;
 method = 'UPI';
 upiId = '';
 cardholderName = '';
 cardNumber = '';
 expiryDate = '';
 cvv = '';
 showCvv = false;
 errors: any = {};
 popupTitle = '';
 popupMessage = '';
 submitting = false;

 constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

 ngOnInit() {
  const navigation = this.router.getCurrentNavigation();
  this.parcelData = navigation?.extras?.state?.['parcelData'] || history.state?.parcelData;
  if (this.parcelData) {
   this.parcelId = this.parcelData.id;
   this.estimatedAmount = Number(this.parcelData.cost ?? this.parcelData.amount ?? 0);
  } else {
   const routeId = Number(this.route.snapshot.paramMap.get('id'));
   if (routeId) {
    this.parcelId = routeId;
    this.http.get(`${environment.apiUrl}/parcels/${routeId}`).subscribe({
     next: (parcel: any) => {
      this.parcelData = parcel;
      this.estimatedAmount = Number(parcel.cost ?? 0);
     },
     error: () => this.showPopup('Payment details missing', 'Could not load parcel payment details. Open payment from your orders.')
    });
   }
  }
 }

 clearPaymentFields() {
  this.errors = {};
  this.upiId = '';
  this.cardholderName = '';
  this.cardNumber = '';
  this.expiryDate = '';
  this.cvv = '';
 }

 limitCardNumber() {
  this.cardNumber = this.cardNumber.replace(/\D/g, '').slice(0, 16);
 }

 formatExpiryDate() {
  const digits = this.expiryDate.replace(/\D/g, '').slice(0, 4);
  this.expiryDate = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
 }

 limitCvv() {
  this.cvv = this.cvv.replace(/\D/g, '').slice(0, 3);
 }

 validateField(field: string) {
  delete this.errors[field];
  if (field === 'upiId' && !/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(this.upiId || '')) this.errors.upiId = 'Enter valid UPI ID, for example name@bank';
  if (field === 'cardholderName' && !/^[A-Za-z ]{3,50}$/.test(this.cardholderName || '')) this.errors.cardholderName = 'Enter valid cardholder name';
  if (field === 'cardNumber' && !/^\d{16}$/.test(this.cardNumber || '')) this.errors.cardNumber = 'Card number must be 16 digits';
  if (field === 'expiryDate') {
   if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiryDate || '')) this.errors.expiryDate = 'Enter valid expiry as MM/YY';
   else if (!this.isFutureExpiry(this.expiryDate)) this.errors.expiryDate = 'Card expiry must be in the future';
  }
  if (field === 'cvv' && !/^[1-9][0-9]{2}$/.test(this.cvv || '')) this.errors.cvv = 'CVV must be 3 digits and cannot start with 0';
 }

 validateForm(): boolean {
  this.errors = {};
  if (!this.parcelId || !this.estimatedAmount) this.errors.payment = 'Payment details are missing. Please open payment from your order.';
  if (this.method === 'UPI') this.validateField('upiId');
  else ['cardholderName', 'cardNumber', 'expiryDate', 'cvv'].forEach(field => this.validateField(field));
  if (this.errors.payment) this.showPopup('Payment details missing', this.errors.payment);
  return Object.keys(this.errors).length === 0;
 }

 submitPayment() {
  if (!this.validateForm() || this.submitting) return;
  this.submitting = true;
  const paymentRequest = {
   parcelId: Number(this.parcelId),
   method: this.method,
   upiId: this.method === 'UPI' ? this.upiId : null,
   cardholderName: this.method !== 'UPI' ? this.cardholderName : null,
   cardNumber: this.method !== 'UPI' ? this.cardNumber : null,
   expiryDate: this.method !== 'UPI' ? this.expiryDate : null,
   cvv: this.method !== 'UPI' ? this.cvv : null
  };

  this.http.post(`${environment.apiUrl}/payments/validate`, paymentRequest).subscribe({
   next: (response: any) => {
   const finish = () => {
     this.submitting = false;
     this.showPopup('Payment successful', 'Payment completed successfully. Redirecting to your orders...');
     setTimeout(() => this.router.navigate(['/user-dashboard'], { state: { activeTab: 'orders', refresh: true } }), 1100);
    };
    if (response.paymentId) {
     this.http.post(`${environment.apiUrl}/payments/update-status`, {
      parcelId: Number(this.parcelId),
      amount: Number(this.estimatedAmount),
      status: 'SUCCESS',
      transactionId: `TXN-${Date.now()}`
     }).subscribe({ next: finish, error: () => { this.submitting = false; this.showPopup('Payment failed', 'Payment was validated, but the final status update failed. Please try again.'); } });
    } else {
     finish();
    }
   },
   error: (error: any) => { this.submitting = false; this.showPopup('Payment failed', error.error?.message || error.error?.error || 'Payment failed'); }
  });
 }

 isFutureExpiry(expiry: string): boolean {
  const [month, shortYear] = expiry.split('/').map(Number);
  const expiryDate = new Date(2000 + shortYear, month, 0, 23, 59, 59);
  return expiryDate >= new Date();
 }

 showPopup(title: string, message: string) {
  this.popupTitle = title;
  this.popupMessage = message;
 }

 closePopup() {
  this.popupMessage = '';
 }

 goDashboard() { this.router.navigate(['/user-dashboard']); }
 goOrders() { this.router.navigate(['/user-dashboard'], { state: { activeTab: 'orders', refresh: true } }); }
}
