import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-manage-orders',
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

  <div class="controls">
   <input type="text" placeholder="Search by tracking ID, receiver or status"
     [(ngModel)]="searchTerm" (ngModelChange)="page = 1" class="search-input" />
  </div>

  <ng-container *ngIf="parcels.length > 0; else noParcels">
   <div class="table-wrapper">
    <table class="parcels-table">
     <thead>
      <tr>
       <th>Tracking ID</th>
       <th>Receiver</th>
       <th>Weight</th>
       <th>Cost</th>
       <th>Status</th>
       <th>Payment</th>
       <th>Actions</th>
      </tr>
     </thead>
     <tbody>
      <tr *ngFor="let parcel of pagedParcels">
       <td>{{ parcel.trackingId }}</td>
       <td>
        {{ parcel.receiverName || '—' }}
        <br><small class="muted">{{ parcel.dropLocation }}</small>
       </td>
       <td>{{ parcel.weight }} g</td>
       <td>INR {{ parcel.cost }}</td>
       <td>
        <span class="status-badge" [ngClass]="'status-' + parcel.status.toLowerCase().replace('_','-')">
         {{ parcel.status }}
        </span>
       </td>
       <td>
        <span class="status-badge" [ngClass]="paymentClass(parcel)">
         {{ paymentLabel(parcel) }}
        </span>
       </td>
       <td class="action-cell">
        <button class="action-btn view-btn"     (click)="viewDetails(parcel)">View</button>
        <button class="action-btn pay-btn"
          [disabled]="parcel.status === 'CANCELLED' || isPaid(parcel)"
          (click)="payForParcel(parcel)">{{ isPaid(parcel) ? 'Paid' : 'Pay' }}</button>
        <button class="action-btn feedback-btn"
          [disabled]="parcel.status !== 'DELIVERED'"
          [title]="parcel.status === 'DELIVERED' ? 'Submit feedback' : 'Feedback available after delivery'"
          (click)="openFeedback(parcel)">Feedback</button>
        <button class="action-btn cancel-btn"
          *ngIf="parcel.status === 'CREATED'"
          (click)="openCancel(parcel)">Cancel</button>
       </td>
      </tr>
     </tbody>
    </table>
   </div>

   <div class="pagination" *ngIf="totalPages > 1">
    <button type="button" (click)="prevPage()" [disabled]="page === 1">Previous</button>
    <span>Page {{ page }} of {{ totalPages }}</span>
    <button type="button" (click)="nextPage()" [disabled]="page === totalPages">Next</button>
   </div>
  </ng-container>

  <!-- EMPTY STATE — gray text -->
  <ng-template #noParcels>
   <div class="no-data">
    <p class="no-data-text">No parcels found.</p>
    <a href="javascript:void(0)" class="book-link" (click)="navigateTo('user/book-parcel')">Book your first parcel</a>
   </div>
  </ng-template>

 </div>

 <!-- VIEW DETAILS MODAL -->
 <div *ngIf="selectedParcel" class="modal" (click)="closeModal()">
  <div class="modal-content" (click)="$event.stopPropagation()">
   <button class="close-btn" (click)="closeModal()">Close</button>
   <h2>{{ selectedParcel.trackingId }}</h2>
   <div class="details-grid">
    <p><strong>Sender:</strong> {{ selectedParcel.senderName || selectedParcel.senderUsername }}</p>
    <p><strong>Pickup:</strong> {{ selectedParcel.pickupAddress }}</p>
    <p><strong>Pickup PIN:</strong> {{ selectedParcel.pickupZipCode }}</p>
    <p><strong>Pickup Contact:</strong> {{ selectedParcel.pickupContactInfo }}</p>
    <p><strong>Receiver:</strong> {{ selectedParcel.receiverName }}</p>
    <p><strong>Drop:</strong> {{ selectedParcel.dropLocation }}</p>
    <p><strong>Drop PIN:</strong> {{ selectedParcel.dropZipCode }}</p>
    <p><strong>Drop Contact:</strong> {{ selectedParcel.dropContactInfo }}</p>
    <p><strong>Weight:</strong> {{ selectedParcel.weight }} g</p>
    <p><strong>Delivery:</strong> {{ getDeliveryLabel(selectedParcel.deliveryType) }}</p>
    <p><strong>Packaging:</strong> {{ getPackagingLabel(selectedParcel.packagingType) }}</p>
    <p><strong>Cost:</strong> INR {{ selectedParcel.cost }}</p>
    <p><strong>Status:</strong> {{ selectedParcel.status }}</p>
    <p><strong>Pickup Date:</strong> {{ selectedParcel.pickupDate }}</p>
    <p><strong>Booked On:</strong> {{ selectedParcel.createdAt | date:'medium' }}</p>
   </div>
   <button class="modal-btn" (click)="downloadInvoice(selectedParcel)">Download Invoice</button>
  </div>
 </div>

 <!-- FEEDBACK MODAL -->
 <div *ngIf="showFeedbackForm" class="modal" (click)="closeFeedback()">
  <div class="modal-content" (click)="$event.stopPropagation()">
   <button class="close-btn" (click)="closeFeedback()">Close</button>
   <h2>Submit Feedback</h2>
   <div class="feedback-form">
    <div class="form-group">
     <label>Rating</label>
     <select [(ngModel)]="feedbackForm.rating">
      <option value="1">1 — Poor</option>
      <option value="2">2 — Fair</option>
      <option value="3">3 — Good</option>
      <option value="4">4 — Very Good</option>
      <option value="5">5 — Excellent</option>
     </select>
    </div>
    <div class="form-group">
     <label>Comment</label>
     <textarea [(ngModel)]="feedbackForm.comment" placeholder="Enter your delivery feedback" rows="3"></textarea>
    </div>
    <button class="modal-btn" (click)="submitFeedback()">Submit Feedback</button>
    <p *ngIf="feedbackMessage" class="message" [ngClass]="feedbackMessageType">{{ feedbackMessage }}</p>
   </div>
  </div>
 </div>

 <!-- CANCEL MODAL -->
 <div *ngIf="cancelParcelTarget" class="modal" (click)="closeCancel()">
  <div class="modal-content" (click)="$event.stopPropagation()">
   <button class="close-btn" (click)="closeCancel()">Close</button>
   <h2>Cancel Parcel</h2>
   <div class="form-group">
    <label>Reason for cancellation</label>
    <textarea [(ngModel)]="cancelReason" placeholder="Enter cancellation reason" rows="3" maxlength="200"
      (ngModelChange)="validateCancelReason()"></textarea>
    <small class="hint">Use 5-200 characters and at least two words.</small>
    <small class="field-error" *ngIf="cancelReasonError">{{ cancelReasonError }}</small>
   </div>
   <button class="modal-btn cancel-confirm-btn" (click)="confirmCancel()" [disabled]="!isCancelReasonValid()">Confirm Cancellation</button>
  </div>
 </div>

 <!-- POPUP -->
 <div *ngIf="popupMessage" class="modal" (click)="popupMessage = ''">
  <div class="modal-content small-popup" (click)="$event.stopPropagation()">
   <button class="close-btn" (click)="popupMessage = ''">Close</button>
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
.main-content { max-width: 1000px; margin: 30px auto; padding: 20px; }
.controls { display: flex; gap: 10px; margin-bottom: 20px; }
.search-input { flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 5px; }
.refresh-btn { padding: 10px 20px; background: white; color: #334155; border: 1px solid #d1d5db; border-radius: 5px; cursor: pointer; font-weight: bold; }
.table-wrapper { background: white; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow-x: auto; }
.parcels-table { width: 100%; border-collapse: collapse; }
.parcels-table th, .parcels-table td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; color: #1f2937; }
.parcels-table th { background: #f5f5f5; font-weight: bold; color: #333; }
.parcels-table tr:hover { background: #fafafa; }
.muted { color: #6b7280; font-size: 12px; }
.status-badge { padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
.status-delivered    { background: #ecfdf5; color: #166534; }
.status-in-transit   { background: #fffbeb; color: #92400e; }
.status-created      { background: #eff6ff; color: #1e3a8a; }
.status-pending      { background: #f1f5f9; color: #475569; }
.status-out-for-delivery { background: #fef3c7; color: #78350f; }
.status-cancelled    { background: #fef2f2; color: #991b1b; }
.action-cell { white-space: nowrap; }
.action-btn { padding: 5px 10px; margin: 0 3px; border: 1px solid #d1d5db; border-radius: 5px; cursor: pointer; font-size: 12px; }
.view-btn     { background: #334155; color: white; }
.pay-btn      { background: #1f2937; color: white; }
.feedback-btn { background: #3f6212; color: white; }
.feedback-btn:disabled { background: #94a3b8; cursor: not-allowed; opacity: 0.8; }
.cancel-btn   { background: #991b1b; color: white; }

/* EMPTY STATE — gray */
.no-data { background: white; padding: 50px 40px; border-radius: 10px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.no-data-text { color: #9ca3af; font-size: 16px; margin: 0 0 12px; }
.book-link { color: #334155; font-weight: bold; text-decoration: none; font-size: 14px; }
.book-link:hover { text-decoration: underline; }

.pagination { display: flex; justify-content: center; align-items: center; gap: 12px; padding: 16px; }
.pagination button { padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 5px; background: white; color: #334155; cursor: pointer; font-weight: bold; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination span { color: white; }
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; color: #1f2937; padding: 30px; border-radius: 10px; max-width: 600px; width: 90%; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.3); max-height: 88vh; overflow-y: auto; }
.close-btn { position: absolute; top: 15px; right: 15px; background: #f1f5f9; border: 1px solid #d1d5db; border-radius: 5px; padding: 6px 10px; font-size: 12px; cursor: pointer; }
.small-popup { max-width: 360px; }
.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-top: 16px; }
.details-grid p { margin: 0; padding: 8px; background: #f8fafc; border-radius: 5px; font-size: 14px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
.form-group select, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
.hint { display: block; color: #6b7280; font-size: 12px; margin-top: 4px; }
.field-error { display: block; color: #991b1b; font-size: 12px; font-weight: bold; margin-top: 4px; }
.modal-btn { width: 100%; padding: 12px; background: #1f2937; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-top: 8px; }
.modal-btn:disabled { opacity: .6; cursor: not-allowed; }
.cancel-confirm-btn { background: #991b1b; }
.message { margin-top: 12px; padding: 10px; border-radius: 5px; text-align: center; }
.success { background: #ecfdf5; color: #166534; }
.error   { background: #fef2f2; color: #991b1b; }
@media (max-width: 640px) {
  .details-grid { grid-template-columns: 1fr; }
}
 `]
})
export class ManageOrdersComponent implements OnInit {

 parcels: any[] = [];
 searchTerm = '';
 page = 1;
 pageSize = 7;

 selectedParcel: any   = null;
 showFeedbackForm      = false;
 feedbackTargetParcel: any = null;
 feedbackForm          = { rating: '5', comment: '' };
 feedbackMessage       = '';
 feedbackMessageType   = '';
 cancelParcelTarget: any = null;
 cancelReason          = '';
 cancelReasonError     = '';
 popupTitle            = '';
 popupMessage          = '';

 constructor(private router: Router, private http: HttpClient) {}

 ngOnInit() { this.loadParcels(); }

 loadParcels() {
  this.http.get<any[]>(`${environment.apiUrl}/parcels`).subscribe({
   next: (data) => { this.parcels = data; this.page = 1; },
   error: () => this.showPopup('Error', 'Failed to load orders. Please try again.')
  });
 }

 get filteredParcels() {
  const s = this.searchTerm.trim().toLowerCase();
  return this.parcels.filter(p =>
   !s || [p.trackingId, p.status, p.receiverName, p.dropLocation]
    .some(v => String(v || '').toLowerCase().includes(s))
  );
 }

 get totalPages() { return Math.max(1, Math.ceil(this.filteredParcels.length / this.pageSize)); }

 get pagedParcels() {
  if (this.page > this.totalPages) this.page = this.totalPages;
  const start = (this.page - 1) * this.pageSize;
  return this.filteredParcels.slice(start, start + this.pageSize);
 }

 prevPage() { if (this.page > 1) this.page--; }
 nextPage() { if (this.page < this.totalPages) this.page++; }

 isPaid(parcel: any) { return parcel.paymentStatus === 'CONFIRMED'; }
 paymentLabel(parcel: any) {
  if (parcel.paymentStatus === 'CONFIRMED') return 'Paid';
  if (parcel.paymentStatus === 'PAYMENT_FAILED') return 'Failed';
  return 'Pending';
 }
 paymentClass(parcel: any) {
  if (parcel.paymentStatus === 'CONFIRMED') return 'payment-paid';
  if (parcel.paymentStatus === 'PAYMENT_FAILED') return 'payment-failed';
  return 'payment-pending';
 }

 viewDetails(parcel: any)   { this.selectedParcel = parcel; }
 closeModal()               { this.selectedParcel = null; }
 payForParcel(parcel: any) { this.router.navigate(['/payment', parcel.id], { state: { parcelData: parcel } }); }

 openFeedback(parcel: any) {
  if (parcel.status !== 'DELIVERED') return;
  this.feedbackTargetParcel = parcel;
  this.feedbackForm = { rating: '5', comment: '' };
  this.feedbackMessage = '';
  this.showFeedbackForm = true;
 }

 closeFeedback() { this.showFeedbackForm = false; }

 submitFeedback() {
  const payload = {
   parcelId: this.feedbackTargetParcel.id,
   rating:     Number(this.feedbackForm.rating),
   comment:    this.feedbackForm.comment
  };

  this.http.post(`${environment.apiUrl}/feedback`, payload).subscribe({
   next: () => {
    this.feedbackMessage     = 'Feedback submitted successfully!';
    this.feedbackMessageType = 'success';
    setTimeout(() => this.closeFeedback(), 1500);
   },
   error: (err: any) => {
    this.feedbackMessage     = err.error?.message || 'Failed to submit feedback.';
    this.feedbackMessageType = 'error';
   }
  });
 }

 openCancel(parcel: any) {
  this.cancelParcelTarget = parcel;
  this.cancelReason = '';
  this.cancelReasonError = '';
 }
 closeCancel() {
  this.cancelParcelTarget = null;
  this.cancelReason = '';
  this.cancelReasonError = '';
 }

 confirmCancel() {
  if (!this.validateCancelReason()) {
   return;
  }
  this.http.post(`${environment.apiUrl}/parcels/${this.cancelParcelTarget.id}/cancel`,
   { parcelId: this.cancelParcelTarget.id, reason: this.getNormalizedCancelReason() }
  ).subscribe({
   next: () => {
    this.closeCancel();
    this.showPopup('Cancelled', 'Parcel cancellation submitted.');
    this.loadParcels();
   },
   error: (err: any) => {
    this.cancelReasonError = this.extractCancelReasonError(err);
   }
  });
 }

 validateCancelReason(): boolean {
  this.cancelReasonError = this.getCancelReasonError();
  return !this.cancelReasonError;
 }

 isCancelReasonValid(): boolean {
  return !this.getCancelReasonError();
 }

 private getCancelReasonError(): string {
  const reason = this.getNormalizedCancelReason();
  const wordCount = reason ? reason.split(' ').length : 0;
  if (!reason) {
   return 'Cancellation reason is required';
  } else if (reason.length < 5) {
   return 'Cancellation reason must be at least 5 characters';
  } else if (wordCount < 2) {
   return 'Cancellation reason must contain at least two words';
  } else if (reason.length > 200) {
   return 'Cancellation reason cannot exceed 200 characters';
  }
  return '';
 }

 private getNormalizedCancelReason(): string {
  return this.cancelReason.trim().replace(/\s+/g, ' ');
 }

 private extractCancelReasonError(err: any): string {
  return err?.error?.data?.fields?.reason
   || err?.error?.message
   || 'Failed to cancel parcel.';
 }

 downloadInvoice(parcel: any) {
  const lines = [
   `INVOICE — Parcel Management System`,
   `Tracking ID: ${parcel.trackingId}`,
   `Sender: ${parcel.senderName || parcel.senderUsername}`,
   `Pickup: ${parcel.pickupAddress} — ${parcel.pickupZipCode}`,
   `Receiver: ${parcel.receiverName}`,
   `Drop: ${parcel.dropLocation} — ${parcel.dropZipCode}`,
   `Weight: ${parcel.weight} g`,
   `Delivery: ${this.getDeliveryLabel(parcel.deliveryType)}`,
   `Packing: ${this.getPackagingLabel(parcel.packagingType)}`,
   `Cost: INR ${parcel.cost}`,
   `Status: ${parcel.status}`,
   `Pickup Date: ${parcel.pickupDate}`,
   `Booked: ${new Date(parcel.createdAt).toLocaleString()}`
  ].join('\n');

  const blob = new Blob([lines], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Parcel Management System-invoice-${parcel.trackingId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
 }

 getDeliveryLabel(type: string) {
  return type === 'EXPRESS' ? 'Express' : type === 'SAME_DAY' ? 'Same-Day' : 'Standard';
 }

 getPackagingLabel(type: string) {
  return type === 'PREMIUM' ? 'Premium' : 'Basic';
 }

 showPopup(title: string, message: string) { this.popupTitle = title; this.popupMessage = message; }

 navigateTo(path: string) { this.router.navigate([`/${path}`]); }
 goBack() { this.router.navigate(['/user-dashboard']); }
 goHome() { this.router.navigate(['/']); }
}
