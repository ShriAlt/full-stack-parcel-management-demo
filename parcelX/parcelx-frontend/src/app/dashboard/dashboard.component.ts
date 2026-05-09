import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
 selector: 'app-dashboard',
 standalone: true,
 imports: [CommonModule, RouterLink],
 template: `<div class="page-section"><div class="page-header"><p class="eyebrow">Overview</p><h2>Dashboard</h2><p>Welcome back,<strong>{{ currentUser }}</strong>. Use the quick actions below to explore the demo project.</p></div><div class="card-grid"><article class="card feature-card"><h3>Parcel Tracking</h3><p>View parcel details, status history, and delivery progress.</p><a class="inline-link" routerLink="/payment/1">Open demo payment</a></article><article class="card feature-card"><h3>Payments</h3><p>Update payment status for the seeded demo parcel and see the result instantly.</p><a class="inline-link" routerLink="/payment/1">Try payment workflow</a></article><article class="card feature-card"><h3>Accounts</h3><p>Use the beginner-friendly demo accounts added on startup for quick testing.</p><span class="mini-badge">admin / admin123</span></article></div></div>`
})
export class DashboardComponent {
 currentUser = localStorage.getItem('username') || 'Demo User';
}

