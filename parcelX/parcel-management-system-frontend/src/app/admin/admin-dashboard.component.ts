import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CountByStatusPipe } from '../core/count-by-status.pipe';

@Component({
 selector: 'app-admin-dashboard',
 standalone: true,
 imports: [CommonModule, FormsModule, CountByStatusPipe],
 template: `
<div class="dashboard-container">
 <nav class="navbar"><div class="nav-brand">Parcel Management System</div><div class="nav-right"><span>{{ username }}</span><button class="logout-btn" (click)="logout()">Logout</button></div></nav>
 <div class="dashboard-wrapper">
  <aside class="sidebar"><ul class="nav-menu">
   <li><a [ngClass]="{'active': activeTab === 'home'}" (click)="switchTab('home')">Dashboard</a></li>
   <li><a [ngClass]="{'active': activeTab === 'orders'}" (click)="switchTab('orders')">All Orders</a></li>
   <li><a [ngClass]="{'active': activeTab === 'book'}" (click)="switchTab('book')">Book Parcel</a></li>
   <li><a [ngClass]="{'active': activeTab === 'users'}" (click)="switchTab('users')">Users</a></li>
   <li><a [ngClass]="{'active': activeTab === 'feedback'}" (click)="switchTab('feedback')">Feedback</a></li>
   <li><a [ngClass]="{'active': activeTab === 'profile'}" (click)="switchTab('profile')">Profile</a></li>
  </ul></aside>
  <main class="main-content">
   <section *ngIf="activeTab === 'home'" class="tab-content">
    <h1>Admin Dashboard</h1><p>Manage parcels, users, feedback, and profile details.</p>
    <div class="stats-grid"><div class="stat-card"><h3>Total Parcels</h3><p class="stat-number">{{ parcels.length }}</p></div><div class="stat-card"><h3>Delivered</h3><p class="stat-number">{{ parcels | countByStatus:'DELIVERED' }}</p></div><div class="stat-card"><h3>In Transit</h3><p class="stat-number">{{ parcels | countByStatus:'IN_TRANSIT' }}</p></div><div class="stat-card"><h3>Users</h3><p class="stat-number">{{ users.length }}</p></div></div>
   </section>

   <section *ngIf="activeTab === 'orders'" class="tab-content">
    <h2>All Orders</h2>
    <div class="table-controls"><input class="search-input" placeholder="Search by tracking ID, status, sender, receiver" [(ngModel)]="searchTerm" (ngModelChange)="page = 1" /><select class="search-input sort-select" [(ngModel)]="weightSort" (ngModelChange)="page = 1"><option value="">Weight Sort</option><option value="asc">Weight: Low to High</option><option value="desc">Weight: High to Low</option></select></div>
    <div class="table-responsive"><table class="parcels-table" *ngIf="filteredAdminParcels.length; else noData"><thead><tr><th>Tracking ID</th><th>Sender</th><th>Receiver</th><th>Weight</th><th>Cost</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead><tbody><tr *ngFor="let parcel of pagedAdminParcels"><td>{{ parcel.trackingId }}</td><td>{{ parcel.senderName || parcel.senderUsername }}<br><small>{{ parcel.senderPhone || parcel.pickupContactInfo }}</small></td><td>{{ parcel.receiverName || 'Receiver' }}<br><small>{{ parcel.dropContactInfo }}</small></td><td>{{ parcel.weight }} g</td><td>INR {{ parcel.cost }}</td><td><span class="status-badge" [ngClass]="paymentClass(parcel)">{{ paymentLabel(parcel) }}</span></td><td><select [(ngModel)]="parcel.status" (change)="updateStatus(parcel)" class="status-select" [disabled]="!isPaid(parcel)" [title]="isPaid(parcel) ? 'Update status' : 'Payment pending'"><option value="CREATED">Created</option><option value="PENDING">Pending</option><option value="IN_TRANSIT">In Transit</option><option value="OUT_FOR_DELIVERY">Out for Delivery</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option></select></td><td><button class="action-btn" (click)="viewDetails(parcel)">View</button></td></tr></tbody></table><div class="pagination" *ngIf="totalPages > 1"><button (click)="prevPage()" [disabled]="page === 1">Previous</button><span>Page {{ page }} of {{ totalPages }}</span><button (click)="nextPage()" [disabled]="page === totalPages">Next</button></div><ng-template #noData><p class="no-data">No parcels found</p></ng-template></div>
   </section>

   <section *ngIf="activeTab === 'book'" class="tab-content">
    <h2>Book Parcel</h2>
    <form (ngSubmit)="bookParcelForUser()" class="booking-form admin-booking-form" autocomplete="off">
     <div class="form-main">
      <div class="form-section"><h3>Pickup Details</h3><div class="form-group"><label>Sender Name</label><input [(ngModel)]="bookForm.senderName" name="senderName" placeholder="Enter sender name" maxlength="40" (ngModelChange)="validateBookField('senderName')" /><small class="field-error" *ngIf="bookErrors.senderName">{{ bookErrors.senderName }}</small></div><div class="form-group"><label>Pickup Address</label><input [(ngModel)]="bookForm.pickupAddress" name="pickupAddress" placeholder="Enter pickup address" maxlength="50" (ngModelChange)="validateBookField('pickupAddress')" /><small class="field-error" *ngIf="bookErrors.pickupAddress">{{ bookErrors.pickupAddress }}</small></div><div class="form-row"><div class="form-group"><label>Pickup PIN Code</label><input [(ngModel)]="bookForm.pickupZipCode" name="pickupZipCode" placeholder="Enter pickup PIN code" maxlength="6" inputmode="numeric" (input)="limitBookDigits('pickupZipCode', 6); validateBookField('pickupZipCode')" /><small class="field-error" *ngIf="bookErrors.pickupZipCode">{{ bookErrors.pickupZipCode }}</small></div><div class="form-group"><label>Pickup Contact</label><input [(ngModel)]="bookForm.pickupContactInfo" name="pickupContactInfo" placeholder="Enter pickup contact number" maxlength="10" inputmode="numeric" (input)="limitBookDigits('pickupContactInfo', 10); validateBookField('pickupContactInfo')" /><small class="field-error" *ngIf="bookErrors.pickupContactInfo">{{ bookErrors.pickupContactInfo }}</small></div></div></div>
      <div class="form-section"><h3>Package Details</h3><div class="form-row"><div class="form-group"><label>Weight (g)</label><input type="text" [(ngModel)]="bookForm.weight" name="weight" placeholder="Enter parcel weight" maxlength="5" inputmode="numeric" (input)="limitBookWeightDigits()" /><small class="field-error" *ngIf="bookErrors.weight">{{ bookErrors.weight }}</small></div><div class="form-group"><label>Pickup Date</label><input type="date" [(ngModel)]="bookForm.pickupDate" name="pickupDate" [min]="minPickupDate" [max]="maxPickupDate" (ngModelChange)="validateBookField('pickupDate')" /><small class="field-error" *ngIf="bookErrors.pickupDate">{{ bookErrors.pickupDate }}</small></div></div><div class="form-row"><div class="form-group"><label>Delivery Type</label><select [(ngModel)]="bookForm.deliveryType" name="deliveryType" (change)="calculateBookCost()"><option value="STANDARD">Standard Delivery - INR 30</option><option value="EXPRESS">Express Delivery - INR 80</option><option value="SAME_DAY">Same-Day Delivery - INR 150</option></select></div><div class="form-group"><label>Packaging Type</label><select [(ngModel)]="bookForm.packagingType" name="packagingType" (change)="calculateBookCost()"><option value="BASIC">Basic Packing - INR 10</option><option value="PREMIUM">Premium Packing - INR 30</option></select></div></div></div>
      <div class="form-section"><h3>Drop Details</h3><div class="form-group"><label>Receiver Name</label><input [(ngModel)]="bookForm.receiverName" name="receiverName" placeholder="Enter receiver name" maxlength="40" (ngModelChange)="validateBookField('receiverName')" /><small class="field-error" *ngIf="bookErrors.receiverName">{{ bookErrors.receiverName }}</small></div><div class="form-group"><label>Drop Location</label><input [(ngModel)]="bookForm.dropLocation" name="dropLocation" placeholder="Enter drop address" maxlength="50" (ngModelChange)="validateBookField('dropLocation')" /><small class="field-error" *ngIf="bookErrors.dropLocation">{{ bookErrors.dropLocation }}</small></div><div class="form-row"><div class="form-group"><label>Drop PIN Code</label><input [(ngModel)]="bookForm.dropZipCode" name="dropZipCode" placeholder="Enter drop PIN code" maxlength="6" inputmode="numeric" (input)="limitBookDigits('dropZipCode', 6); validateBookField('dropZipCode')" /><small class="field-error" *ngIf="bookErrors.dropZipCode">{{ bookErrors.dropZipCode }}</small></div><div class="form-group"><label>Drop Contact</label><input [(ngModel)]="bookForm.dropContactInfo" name="dropContactInfo" placeholder="Enter drop contact number" maxlength="10" inputmode="numeric" (input)="limitBookDigits('dropContactInfo', 10); validateBookField('dropContactInfo')" /><small class="field-error" *ngIf="bookErrors.dropContactInfo">{{ bookErrors.dropContactInfo }}</small></div></div></div>
      <button type="submit" class="submit-btn">Book Parcel</button>
     </div><aside class="cost-display"><p>Total Cost</p><strong>INR {{ bookEstimatedCost }}</strong><small>Base 50 + weight 0.02/g + delivery + packing + 5% tax</small></aside>
    </form>
   </section>

   <section *ngIf="activeTab === 'users'" class="tab-content"><h2>All Users</h2><div class="table-controls"><input class="search-input" placeholder="Search users by name, username, email, phone" [(ngModel)]="userSearchTerm" /></div><div class="table-responsive"><table class="parcels-table"><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>PIN</th><th>Orders</th><th>Action</th></tr></thead><tbody><tr *ngFor="let user of filteredUsers"><td>{{ user.name || '-' }}</td><td>{{ user.username }}</td><td>{{ user.email }}</td><td>{{ user.phone }}</td><td>{{ user.zipCode }}</td><td>{{ ordersForUser(user).length }}</td><td><button class="action-btn" (click)="viewUserOrders(user)">View Orders</button></td></tr></tbody></table></div></section>

   <section *ngIf="activeTab === 'feedback'" class="tab-content"><h2>Feedback</h2><div class="feedback-list" *ngIf="feedbackList.length; else noFeedback"><article *ngFor="let feedback of feedbackList" class="feedback-card"><strong>{{ feedback.trackingId }}</strong><span>Rating: {{ feedback.rating }}/5</span><p>{{ feedback.comment || 'No comment' }}</p><small>{{ feedback.userName || feedback.username }} - {{ feedback.createdAt | date:'medium' }}</small></article></div><ng-template #noFeedback><p class="no-data">No feedback found</p></ng-template></section>

   <section *ngIf="activeTab === 'profile'" class="tab-content"><h2>Admin Profile</h2><form *ngIf="profile" class="profile-form" (ngSubmit)="updateProfile()"><div class="form-group"><label>Username</label><input [value]="profile.username" disabled /></div><div class="form-group"><label>Email</label><input [(ngModel)]="profile.email" name="email" placeholder="Enter your email address" (ngModelChange)="validateProfileField('email')" /><small class="field-error" *ngIf="profileErrors.email">{{ profileErrors.email }}</small></div><div class="form-group"><label>Phone</label><input [(ngModel)]="profile.phone" name="phone" placeholder="Enter your mobile number" maxlength="10" inputmode="numeric" (input)="limitProfileDigits('phone', 10); validateProfileField('phone')" /><small class="field-error" *ngIf="profileErrors.phone">{{ profileErrors.phone }}</small></div><div class="form-group"><label>Address</label><input [(ngModel)]="profile.address" name="address" placeholder="Enter your address" maxlength="120" (ngModelChange)="validateProfileField('address')" /><small class="field-error" *ngIf="profileErrors.address">{{ profileErrors.address }}</small></div><div class="form-row"><div class="form-group"><label>City</label><input [(ngModel)]="profile.city" name="city" placeholder="Enter your city" (ngModelChange)="validateProfileField('city')" /><small class="field-error" *ngIf="profileErrors.city">{{ profileErrors.city }}</small></div><div class="form-group"><label>State</label><input [(ngModel)]="profile.state" name="state" placeholder="Enter your state" (ngModelChange)="validateProfileField('state')" /><small class="field-error" *ngIf="profileErrors.state">{{ profileErrors.state }}</small></div><div class="form-group"><label>PIN Code</label><input [(ngModel)]="profile.zipCode" name="zipCode" placeholder="Enter your PIN code" maxlength="6" inputmode="numeric" (input)="limitProfileDigits('zipCode', 6); validateProfileField('zipCode')" /><small class="field-error" *ngIf="profileErrors.zipCode">{{ profileErrors.zipCode }}</small></div></div><button class="submit-btn" type="submit">Save Changes</button></form></section>
  </main>
 </div>

 <div *ngIf="selectedParcel" class="modal" (click)="selectedParcel = null"><div class="modal-content large-modal" (click)="$event.stopPropagation()"><button class="close-btn" (click)="selectedParcel = null">Close</button><h2>{{ selectedParcel.trackingId }}</h2><div class="details-grid"><p><strong>Sender Name:</strong> {{ selectedParcel.senderName || selectedParcel.senderUsername }}</p><p><strong>Sender Username:</strong> {{ selectedParcel.senderUsername }}</p><p><strong>Sender Email:</strong> {{ selectedParcel.senderEmail }}</p><p><strong>Sender Phone:</strong> {{ selectedParcel.senderPhone || selectedParcel.pickupContactInfo }}</p><p><strong>Sender Address:</strong> {{ selectedParcel.senderAddress }}</p><p><strong>Pickup Address:</strong> {{ selectedParcel.pickupAddress }}</p><p><strong>Pickup PIN:</strong> {{ selectedParcel.pickupZipCode }}</p><p><strong>Pickup Contact:</strong> {{ selectedParcel.pickupContactInfo }}</p><p><strong>Receiver Name:</strong> {{ selectedParcel.receiverName }}</p><p><strong>Drop Location:</strong> {{ selectedParcel.dropLocation }}</p><p><strong>Drop PIN:</strong> {{ selectedParcel.dropZipCode }}</p><p><strong>Drop Contact:</strong> {{ selectedParcel.dropContactInfo }}</p><p><strong>Weight:</strong> {{ selectedParcel.weight }} g</p><p><strong>Delivery:</strong> {{ selectedParcel.deliveryType }}</p><p><strong>Packaging:</strong> {{ selectedParcel.packagingType }}</p><p><strong>Cost:</strong> INR {{ selectedParcel.cost }}</p><p><strong>Payment:</strong> {{ paymentLabel(selectedParcel) }}</p><p><strong>Payment Method:</strong> {{ selectedParcel.paymentMethod || '-' }}</p><p><strong>Transaction:</strong> {{ selectedParcel.transactionId || '-' }}</p><p><strong>Status:</strong> {{ selectedParcel.status }}</p><p><strong>Pickup Date:</strong> {{ selectedParcel.pickupDate }}</p><p><strong>Created:</strong> {{ selectedParcel.createdAt | date:'medium' }}</p><p><strong>Updated:</strong> {{ selectedParcel.updatedAt | date:'medium' }}</p></div></div></div>
 <div *ngIf="selectedUser" class="modal" (click)="selectedUser = null"><div class="modal-content large-modal" (click)="$event.stopPropagation()"><button class="close-btn" (click)="selectedUser = null">Close</button><h2>{{ selectedUser.name || selectedUser.username }} Orders</h2><table class="parcels-table" *ngIf="ordersForUser(selectedUser).length; else selectedNoOrders"><thead><tr><th>Tracking ID</th><th>Receiver</th><th>Status</th><th>Payment</th><th>Cost</th></tr></thead><tbody><tr *ngFor="let order of ordersForUser(selectedUser)"><td>{{ order.trackingId }}</td><td>{{ order.receiverName || order.dropLocation }}</td><td>{{ order.status }}</td><td>{{ paymentLabel(order) }}</td><td>INR {{ order.cost }}</td></tr></tbody></table><ng-template #selectedNoOrders><p>No orders for this user.</p></ng-template></div></div>
 <div *ngIf="popupMessage" class="modal" (click)="popupMessage = ''"><div class="modal-content small-popup" (click)="$event.stopPropagation()"><button class="close-btn" (click)="popupMessage = ''">Close</button><h2>{{ popupTitle }}</h2><p>{{ popupMessage }}</p></div></div>
 <footer class="footer"><p>&copy; 2026 Parcel Management System. All rights reserved.</p></footer>
</div>`,
 styles: [`.dashboard-container{min-height:100vh;display:flex;flex-direction:column;background:#f5f5f5}.navbar{background:#1f2937;color:white;padding:15px 30px;display:flex;justify-content:space-between;align-items:center}.nav-brand{font-size:24px;font-weight:bold}.nav-right{display:flex;align-items:center;gap:20px}.logout-btn,.refresh-btn,.action-btn,.submit-btn{background:#1f2937;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold}.logout-btn{padding:8px 16px;background:rgba(255,255,255,.3)}.dashboard-wrapper{flex:1;display:flex}.sidebar{width:250px;background:white;box-shadow:2px 0 10px rgba(0,0,0,.05);padding:20px 0}.nav-menu{list-style:none;padding:0;margin:0}.nav-menu a{display:block;padding:15px 20px;color:#333;text-decoration:none;border-left:4px solid transparent;cursor:pointer}.nav-menu a:hover,.nav-menu a.active{background:#f0f0f0;border-left-color:#334155;color:#334155}.main-content{flex:1;padding:30px;overflow-y:auto}.tab-content{background:white;color:#445670;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,.05)}.tab-content h1,.tab-content h2,.tab-content h3{color:#111827}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-top:20px}.stat-card{background:#f8fafc;color:#111827;border:1px solid #e2e8f0;padding:20px;border-radius:8px;text-align:center}.stat-number{font-size:36px;font-weight:bold;color:#334155;margin:10px 0 0}.table-controls{display:flex;gap:10px;margin-bottom:20px}.search-input{flex:1;padding:10px;border:1px solid #ddd;border-radius:5px;color:#111827;background:white}.sort-select{min-width:190px;flex:0 0 190px}.refresh-btn{padding:10px 20px}.table-responsive{margin-top:20px;overflow-x:auto}.parcels-table{width:100%;border-collapse:collapse}.parcels-table th,.parcels-table td{padding:12px;text-align:left;border-bottom:1px solid #ddd;color:#1f2937}.parcels-table th{background:#f5f5f5;color:#333}.status-select{padding:6px 10px;border:1px solid #ddd;border-radius:5px;background:white;color:#111827}.status-badge{padding:5px 10px;border-radius:20px;font-size:12px;font-weight:bold}.payment-paid{background:#ecfdf5;color:#166534}.payment-failed{background:#fef2f2;color:#991b1b}.payment-pending{background:#f1f5f9;color:#475569}.action-btn{padding:7px 12px}.booking-form{margin-top:20px}.admin-booking-form{display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:24px;align-items:start}.form-section{margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #e5e7eb}.form-group{margin-bottom:15px}.form-row{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.profile-form .form-row{grid-template-columns:repeat(3,1fr)}.form-group label{display:block;margin-bottom:5px;font-weight:bold;color:#333}.form-group input,.form-group select{width:100%;padding:10px;border:1px solid #ddd;border-radius:5px;box-sizing:border-box;color:#111827;background:white}.form-group input::placeholder,.search-input::placeholder{color:#64748b;opacity:1}.submit-btn{width:100%;padding:12px 30px}.cost-display{background:#f8fafc;color:#1f2937;padding:24px;border:1px solid #e2e8f0;border-radius:8px;text-align:center;position:sticky;top:24px}.cost-display p{margin:0;font-size:18px;font-weight:700;color:#334155}.cost-display strong{display:block;margin-top:8px;font-size:26px;color:#111827}.cost-display small{display:block;margin-top:8px;color:#64748b}.field-error{display:block;color:#dc2626;margin-top:5px;font-size:12px;font-weight:bold}.pagination{display:flex;justify-content:center;align-items:center;gap:12px;padding:16px;color:#1f2937}.pagination button{padding:8px 12px;border:1px solid #d1d5db;border-radius:5px;background:white;color:#334155;cursor:pointer}.pagination button:disabled{opacity:.5;cursor:not-allowed}.no-data{text-align:center;color:#6b7280;padding:20px;font-weight:700}.feedback-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:20px}.feedback-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;color:#1f2937}.feedback-card span,.feedback-card small{display:block;color:#475569;margin-top:6px}.modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}.modal-content{background:white;color:#1f2937;padding:30px;border-radius:10px;max-width:500px;width:90%;position:relative;box-shadow:0 10px 40px rgba(0,0,0,.3);max-height:86vh;overflow:auto}.large-modal{max-width:900px}.small-popup{max-width:360px}.close-btn{position:absolute;top:15px;right:15px;background:#f1f5f9;border:1px solid #d1d5db;font-size:12px;cursor:pointer}.details-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 20px}.details-grid p{margin:0;padding:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px}.footer{background:#333;color:white;text-align:center;padding:20px;margin-top:auto}@media (max-width:900px){.dashboard-wrapper{display:block}.sidebar{width:auto}.admin-booking-form{grid-template-columns:1fr}.cost-display{position:static;order:-1}.form-row,.profile-form .form-row,.details-grid{grid-template-columns:1fr}.table-controls{display:block}.search-input,.refresh-btn{width:100%;margin-bottom:10px}}`]
})
export class AdminDashboardComponent implements OnInit {
 username = '';
 activeTab = 'home';
 parcels: any[] = [];
 users: any[] = [];
 feedbackList: any[] = [];
 searchTerm = '';
 userSearchTerm = '';
 weightSort: '' | 'asc' | 'desc' = '';
 minPickupDate = '';
 maxPickupDate = '';
 bookEstimatedCost = 94.5;
 bookForm: any = this.emptyBookForm();
 bookErrors: any = {};
 profile: any = null;
 profileErrors: any = {};
 selectedParcel: any = null;
 selectedUser: any = null;
 popupTitle = '';
 popupMessage = '';
 page = 1;
 pageSize = 5;

 constructor(private router: Router, private http: HttpClient) {}

 ngOnInit() {
  this.username = localStorage.getItem('username') || 'Admin';
  if (history.state?.loginAcknowledgement) this.showPopup('Welcome to Parcel Management System', `Logged in successfully as ${this.username}.`);
  const today = new Date();
  this.minPickupDate = today.toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  this.maxPickupDate = maxDate.toISOString().split('T')[0];
  this.calculateBookCost();
  this.loadParcels();
  this.loadUsers();
 }

 switchTab(tab: string) {
  this.activeTab = tab;
  if (tab === 'orders') this.loadParcels();
  if (tab === 'users') { this.loadUsers(); this.loadParcels(); }
  if (tab === 'feedback') this.loadFeedback();
  if (tab === 'profile') this.loadProfile();
 }

 loadParcels() {
  this.http.get(`${environment.apiUrl}/parcels/admin/all`).subscribe({ next: (data: any) => this.parcels = data, error: () => this.showPopup('Error', 'Failed to load parcels') });
 }

 loadUsers() {
  this.http.get(`${environment.apiUrl}/users/admin/all`).subscribe({ next: (data: any) => this.users = data, error: () => this.showPopup('Error', 'Failed to load users') });
 }

 loadFeedback() {
  this.http.get(`${environment.apiUrl}/feedback/admin/all`).subscribe({ next: (data: any) => this.feedbackList = data, error: () => this.showPopup('Error', 'Failed to load feedback') });
 }

 loadProfile() {
  this.http.get(`${environment.apiUrl}/users/profile`).subscribe({ next: (data: any) => this.profile = data, error: () => this.showPopup('Error', 'Failed to load profile') });
 }

 updateStatus(parcel: any) {
  if (!this.isPaid(parcel)) {
   this.showPopup('Payment pending', 'Status can be changed only after payment is completed.');
   return;
  }
  this.http.put(`${environment.apiUrl}/parcels/admin/${parcel.id}/status`, { status: parcel.status }).subscribe({ next: () => this.showPopup('Success', 'Status updated successfully'), error: () => this.showPopup('Error', 'Failed to update status') });
 }

 get filteredAdminParcels() {
  const search = this.searchTerm.trim().toLowerCase();
  const filtered = this.parcels.filter(parcel => !search || [parcel.trackingId, parcel.status, parcel.dropLocation, parcel.receiverName, parcel.senderName, parcel.senderUsername, parcel.senderPhone].some(value => String(value || '').toLowerCase().includes(search)));
  if (!this.weightSort) return filtered;
  return [...filtered].sort((a, b) => this.weightSort === 'asc' ? (Number(a.weight) || 0) - (Number(b.weight) || 0) : (Number(b.weight) || 0) - (Number(a.weight) || 0));
 }

 get totalPages() {
  return Math.max(1, Math.ceil(this.filteredAdminParcels.length / this.pageSize));
 }

 get pagedAdminParcels() {
  if (this.page > this.totalPages) this.page = this.totalPages;
  const start = (this.page - 1) * this.pageSize;
  return this.filteredAdminParcels.slice(start, start + this.pageSize);
 }

 get filteredUsers() {
  const search = this.userSearchTerm.trim().toLowerCase();
  return this.users.filter(user => !search || [user.name, user.username, user.email, user.phone].some(value => String(value || '').toLowerCase().includes(search)));
 }

 ordersForUser(user: any) {
  return this.parcels.filter(parcel => parcel.senderUsername === user.username || parcel.senderEmail === user.email || parcel.senderPhone === user.phone);
 }

 isPaid(parcel: any) {
  return parcel.paymentStatus === 'CONFIRMED';
 }

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

 viewUserOrders(user: any) {
  this.selectedUser = user;
 }

 emptyBookForm() {
  return { senderName: '', pickupAddress: '', pickupZipCode: '', pickupContactInfo: '', receiverName: '', dropLocation: '', dropZipCode: '', dropContactInfo: '', weight: '', deliveryType: 'STANDARD', packagingType: 'BASIC', pickupDate: '' };
 }

 calculateBookCost() {
  const weight = Number(this.bookForm.weight) || 0;
  const deliveryCharge = this.bookForm.deliveryType === 'SAME_DAY' ? 150 : this.bookForm.deliveryType === 'EXPRESS' ? 80 : 30;
  const packagingCharge = this.bookForm.packagingType === 'PREMIUM' ? 30 : 10;
  this.bookEstimatedCost = Math.round((50 + (0.02 * weight) + deliveryCharge + packagingCharge) * 1.05 * 100) / 100;
 }

 limitBookDigits(field: string, length: number) {
  this.bookForm[field] = String(this.bookForm[field] || '').replace(/\D/g, '').slice(0, length);
 }

 limitBookWeightDigits() {
  this.limitBookDigits('weight', 5);
  this.calculateBookCost();
  this.validateBookField('weight');
 }

 validateBookField(field: string) {
  const value = this.bookForm[field];
  delete this.bookErrors[field];
  if ((field === 'senderName' || field === 'receiverName') && !/^[A-Za-z ]{3,40}$/.test(value || '')) this.bookErrors[field] = 'Name must contain only letters and minimum 3 characters';
  if ((field === 'pickupAddress' || field === 'dropLocation') && (!value || value.trim().length < 10)) this.bookErrors[field] = 'Address must contain minimum 10 characters';
  if ((field === 'pickupAddress' || field === 'dropLocation') && this.sameAddress(this.bookForm.pickupAddress, this.bookForm.dropLocation)) this.bookErrors.dropLocation = 'Sender and receiver addresses cannot be the same';
  if ((field === 'pickupZipCode' || field === 'dropZipCode') && !/^[1-9][0-9]{5}$/.test(value || '')) this.bookErrors[field] = 'Enter valid 6 digit Indian PIN code';
  if ((field === 'pickupContactInfo' || field === 'dropContactInfo') && !/^[6-9]\d{9}$/.test(value || '')) this.bookErrors[field] = 'Enter valid mobile number';
  if (field === 'weight') {
   const weight = Number(value);
   if (!/^\d{1,5}$/.test(value || '')) this.bookErrors.weight = 'Weight must contain maximum 5 digits';
   else if (weight < 50) this.bookErrors.weight = 'Minimum parcel weight is 50 grams';
   else if (weight > 30000) this.bookErrors.weight = 'Maximum parcel weight is 30,000 grams';
  }
  if (field === 'pickupDate' && (!value || value < this.minPickupDate || value > this.maxPickupDate)) this.bookErrors.pickupDate = 'Pickup Date must be within the next 30 days';
 }

 validateBookForm(): boolean {
  this.bookErrors = {};
  Object.keys(this.emptyBookForm()).filter(field => !['deliveryType', 'packagingType'].includes(field)).forEach(field => this.validateBookField(field));
  return Object.keys(this.bookErrors).length === 0;
 }

 bookParcelForUser() {
  if (!this.validateBookForm()) return;
  this.http.post(`${environment.apiUrl}/parcels`, { ...this.bookForm, weight: Number(this.bookForm.weight) }).subscribe({
   next: () => { this.showPopup('Parcel booked', 'Parcel booked successfully. Redirecting to all orders...'); this.bookForm = this.emptyBookForm(); this.calculateBookCost(); this.loadParcels(); setTimeout(() => this.switchTab('orders'), 900); },
   error: (error: any) => this.showPopup('Booking failed', error.error?.message || error.error?.error || 'Failed to book parcel')
  });
 }

 viewDetails(parcel: any) { this.selectedParcel = parcel; }
 nextPage() { if (this.page < this.totalPages) this.page++; }
 prevPage() { if (this.page > 1) this.page--; }

 limitProfileDigits(field: string, length: number) {
  this.profile[field] = String(this.profile[field] || '').replace(/\D/g, '').slice(0, length);
 }

 validateProfileField(field: string) {
  delete this.profileErrors[field];
  const value = String(this.profile?.[field] || '').trim();
  if (field === 'email' && !/^(?!.*\.\.)(?![0-9]+@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(value)) this.profileErrors.email = 'Enter a valid email such as name@example.com';
  if (field === 'phone' && !/^[6-9]\d{9}$/.test(value)) this.profileErrors.phone = 'Phone must be a valid 10 digit number';
  if (field === 'address' && value.length < 10) this.profileErrors.address = 'Address must contain at least 10 characters';
  if ((field === 'city' || field === 'state') && !/^(?=.{3,50}$)[A-Za-z]+(?: [A-Za-z]+)*$/.test(String(this.profile?.[field] || ''))) this.profileErrors[field] = 'Use 3-50 letters with single spaces only';
  if (field === 'zipCode' && !/^[1-9][0-9]{5}$/.test(value)) this.profileErrors.zipCode = 'Pin code must be a valid 6 digit Indian PIN code';
 }

 updateProfile() {
  this.profileErrors = {};
  ['email', 'phone', 'address', 'city', 'state', 'zipCode'].forEach(field => this.validateProfileField(field));
  if (Object.keys(this.profileErrors).length) return;
  const request = { email: this.profile.email, phone: this.profile.phone, address: this.profile.address, city: this.profile.city, state: this.profile.state, zipCode: this.profile.zipCode };
  this.http.put(`${environment.apiUrl}/users/profile`, request).subscribe({ next: () => this.showPopup('Profile updated', 'Admin profile updated successfully'), error: (error: any) => this.showPopup('Update failed', error.error?.message || error.error?.error || 'Failed to update profile') });
 }

 sameAddress(a: string, b: string) { return !!a && !!b && a.trim().replace(/\s+/g, ' ').toLowerCase() === b.trim().replace(/\s+/g, ' ').toLowerCase(); }
 showPopup(title: string, message: string) { this.popupTitle = title; this.popupMessage = message; }
 logout() { localStorage.clear(); this.router.navigate(['/']); }
}
