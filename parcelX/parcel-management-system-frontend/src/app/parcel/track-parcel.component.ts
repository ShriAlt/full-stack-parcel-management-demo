import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
 selector: 'app-track-parcel',
 standalone: true,
 imports: [FormsModule, CommonModule],
 template: `<div class="page-wrapper"><div class="navbar"><div class="nav-brand">Track Parcel</div><button class="back-btn" (click)="goBack()">Back</button></div><div class="main-content"><div class="search-card"><h1>Track Your Parcel</h1><p>Enter your tracking ID to check the status</p><div class="search-box"><input 
 type="text" 
 [(ngModel)]="trackingId" 
 placeholder="Enter tracking ID"
 class="search-input"
 (keyup.enter)="trackParcel()"
 /><button class="search-btn" (click)="trackParcel()">Search</button></div><p *ngIf="message" [ngClass]="messageType" class="message">{{ message }}</p></div><div *ngIf="result" class="result-card"><h2>Tracking Results</h2><div class="result-details"><div class="detail-row"><span class="label">Tracking ID:</span><span class="value">{{ result.trackingId }}</span></div><div class="detail-row"><span class="label">Status:</span><span class="value" [ngClass]="'status-' + result.status.toLowerCase()">{{ result.status }}</span></div><div class="detail-row"><span class="label">Message:</span><span class="value">{{ result.message }}</span></div></div><div class="timeline"><div class="timeline-item" [ngClass]="{'active': isStatusReached('CREATED')}"><div class="timeline-marker">1</div><p>Created</p></div><div class="timeline-item" [ngClass]="{'active': isStatusReached('PENDING')}"><div class="timeline-marker">2</div><p>Pending</p></div><div class="timeline-item" [ngClass]="{'active': isStatusReached('IN_TRANSIT')}"><div class="timeline-marker">3</div><p>In Transit</p></div><div class="timeline-item" [ngClass]="{'active': isStatusReached('OUT_FOR_DELIVERY')}"><div class="timeline-marker">4</div><p>Out for Delivery</p></div><div class="timeline-item" [ngClass]="{'active': isStatusReached('DELIVERED')}"><div class="timeline-marker">5</div><p>Delivered</p></div></div></div></div></div>`,
 styles: [`
 .page-wrapper {
 min-height: 100vh;
 background: #1f2937;
 }

 .navbar {
 background: rgba(0, 0, 0, 0.3);
 color: white;
 padding: 15px 30px;
 display: flex;
 justify-content: space-between;
 align-items: center;
 }

 .nav-brand {
 font-size: 24px;
 font-weight: bold;
 }

 .back-btn {
 padding: 10px 20px;
 background: rgba(255, 255, 255, 0.3);
 color: white;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 }

 .main-content {
 max-width: 700px;
 margin: 30px auto;
 padding: 20px;
 }

 .search-card {
 background: white;
 padding: 40px;
 border-radius: 10px;
 box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
 text-align: center;
 }

 .search-card h1 {
 margin-top: 0;
 color: #333;
 }

 .search-card p {
 color: #999;
 }

 .search-box {
 display: flex;
 gap: 10px;
 margin: 30px 0;
 }

 .search-input {
 flex: 1;
 padding: 15px;
 border: 2px solid #ddd;
 border-radius: 5px;
 font-size: 16px;
 }

 .search-input:focus {
 outline: none;
 border-color: #334155;
 }

 .search-btn {
 padding: 15px 30px;
 background: #1f2937;
 color: white;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 font-weight: bold;
 transition: all 0.3s ease;
 }

 .search-btn:hover {
 box-shadow: 0 5px 20px rgba(15, 23, 42, 0.18);
 }

 .message {
 margin-top: 15px;
 padding: 15px;
 border-radius: 5px;
 }

 .message.success {
 background: #ecfdf5;
 color: #166534;
 border: 1px solid #bbf7d0;
 }

 .message.error {
 background: #fef2f2;
 color: #991b1b;
 border: 1px solid #fecaca;
 }

 .result-card {
 background: white;
 padding: 30px;
 border-radius: 10px;
 box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
 margin-top: 20px;
 }

 .result-card h2 {
 margin-top: 0;
 color: #333;
 }

 .result-details {
 background: #f5f5f5;
 padding: 20px;
 border-radius: 5px;
 margin-bottom: 20px;
 }

 .detail-row {
 display: flex;
 justify-content: space-between;
 padding: 10px 0;
 border-bottom: 1px solid #ddd;
 }

 .detail-row:last-child {
 border-bottom: none;
 }

 .label {
 font-weight: bold;
 color: #334155;
 }

 .value {
 color: #333;
 }

 .status-delivered {
 color: #166534;
 font-weight: bold;
 }

 .status-in_transit {
 color: #92400e;
 font-weight: bold;
 }

 .status-pending {
 color: #1e3a8a;
 font-weight: bold;
 }

 .status-created {
 color: #6b7280;
 font-weight: bold;
 }

 .timeline {
 display: flex;
 justify-content: space-between;
 margin-top: 30px;
 padding-top: 30px;
 border-top: 2px solid #eee;
 }

 .timeline-item {
 text-align: center;
 opacity: 0.5;
 transition: all 0.3s ease;
 }

 .timeline-item.active {
 opacity: 1;
 color: #334155;
 }

 .timeline-marker {
 width: 34px;
 height: 34px;
 margin: 0 auto 10px;
 border-radius: 50%;
 display: grid;
 place-items: center;
 background: #f1f5f9;
 color: #334155;
 font-size: 13px;
 font-weight: 700;
 }

 .timeline-item p {
 margin: 0;
 font-size: 12px;
 font-weight: bold;
 }
 `]
})
export class TrackParcelComponent {
 trackingId = '';
 result: any = null;
 message = '';
 messageType = '';
 statusHierarchy = ['CREATED', 'PENDING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];

 constructor(private router: Router, private http: HttpClient) {}

 trackParcel() {
 if (!this.trackingId.trim()) {
 this.message = 'Please enter a tracking ID';
 this.messageType = 'error';
 return;
 }

 this.http.get(`${environment.apiUrl}/parcels/track/${this.trackingId}`).subscribe({
 next: (response: any) =>{
 this.result = response;
 this.message = '';
 },
 error: () =>{
 this.message = 'Parcel not found';
 this.messageType = 'error';
 this.result = null;
 }
 });
 }

 isStatusReached(status: string): boolean {
 if (!this.result) return false;
 const currentIndex = this.statusHierarchy.indexOf(this.result.status);
 const statusIndex = this.statusHierarchy.indexOf(status);
 return statusIndex<= currentIndex;
 }

 getStatusIcon(status: string): string {
 const icons: any = {
 'CREATED': 'Created',
 'PENDING': 'Pending',
 'IN_TRANSIT': 'Transit',
 'OUT_FOR_DELIVERY': 'Delivery',
 'DELIVERED': 'Delivered',
 'CANCELLED': 'Cancelled'
 };
 return icons[status] || 'Unknown';
 }

 goBack() {
 this.router.navigate(['/user-dashboard']);
 }
}

