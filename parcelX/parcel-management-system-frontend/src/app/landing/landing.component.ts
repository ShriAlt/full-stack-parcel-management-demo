import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
 selector: 'app-landing',
 standalone: true,
 template: `
  <main class="landing-page">
   <nav class="landing-nav">
    <div class="brand-mark">Parcel Management System</div>
    <div class="nav-actions">
     <button type="button" class="ghost-btn" (click)="goToLogin()">Sign In</button>
     <button type="button" class="solid-btn" (click)="goToRegister()">Create Account</button>
    </div>
   </nav>

   <section class="hero">
    <div class="hero-copy">
     <p class="eyebrow">Parcel Management System</p>
     <h1>Welcome to <span class="brand-accent">Parcel Management System</span></h1>
     <p class="hero-text">
      Book parcels, pay securely, track every shipment, and manage delivery history from one clean dashboard.
     </p>
     <div class="hero-actions">
      <button type="button" class="solid-btn large" (click)="goToRegister()">Get Started</button>
      <button type="button" class="ghost-btn large" (click)="goToLogin()">Sign In</button>
     </div>
    </div>

    <div class="hero-panel" aria-label="Parcel Management System shipment overview">
     <div class="panel-header">
      <span>Live Shipment</span>
      <strong>TRK-X2048</strong>
     </div>
     <div class="route-line">
      <div><span class="dot active"></span><p>Booked</p></div>
      <div><span class="dot active"></span><p>In Transit</p></div>
      <div><span class="dot"></span><p>Delivered</p></div>
     </div>
     <div class="metric-grid">
      <div><span>Delivery</span><strong>Express</strong></div>
      <div><span>Packing</span><strong>Premium</strong></div>
      <div><span>Cost</span><strong>INR 210</strong></div>
      <div><span>Status</span><strong>On time</strong></div>
     </div>
    </div>
   </section>

   <section class="feature-strip">
    <article>
     <span>01</span>
     <h3>Book Fast</h3>
     <p>Enter parcel details and get an instant service cost estimate.</p>
    </article>
    <article>
     <span>02</span>
     <h3>Track Clearly</h3>
     <p>Use your tracking ID to follow each parcel through delivery stages.</p>
    </article>
    <article>
     <span>03</span>
     <h3>Manage Orders</h3>
     <p>View invoices, status, feedback, and booking history in one place.</p>
    </article>
   </section>

   <footer class="landing-footer">
    <div>
     <strong>Parcel Management System</strong>
     <p>Parcel booking, payments, tracking, and order management for customers and admins.</p>
    </div>
    <p class="footer-copy">&copy; 2026 Parcel Management System. All rights reserved.</p>
   </footer>
  </main>
 `,
 styles: [`
  .landing-page {
   min-height: 100vh;
   background: #f8fafc;
   color: #111827;
  }

  .landing-nav {
   height: 76px;
   padding: 0 6vw;
   background: #1f2937;
   color: white;
   display: flex;
   align-items: center;
   justify-content: space-between;
  }

  .brand-mark {
   font-size: 28px;
   font-weight: 800;
   letter-spacing: -0.5px;
   white-space: nowrap;
   color: white;
  }

  .brand-accent {
   color: #60a5fa;
  }

  .nav-actions {
   display: flex;
   gap: 12px;
   align-items: center;
  }

  .hero-actions {
   display: flex;
   gap: 14px;
   align-items: center;
  }

  button { font: inherit; }

  .solid-btn,
  .ghost-btn {
   min-height: 44px;
   padding: 0 20px;
   border-radius: 6px;
   font-weight: 700;
   cursor: pointer;
   transition: all 0.2s;
  }

  .solid-btn {
   background: #334155;
   color: white;
   border: 1px solid #334155;
  }

  .solid-btn:hover { background: #475569; }

  .ghost-btn {
   background: transparent;
   color: white;
   border: 1px solid rgba(255,255,255,0.5);
  }

  .ghost-btn:hover { background: rgba(255,255,255,0.08); }

  .solid-btn.large,
  .ghost-btn.large {
   min-height: 50px;
   padding: 0 28px;
   font-size: 16px;
  }

  .hero .ghost-btn {
   color: #1f2937;
   border-color: #94a3b8;
  }

  .hero {
   min-height: calc(100vh - 220px);
   padding: 72px 6vw 56px;
   display: grid;
   grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.75fr);
   gap: 56px;
   align-items: center;
  }

  .eyebrow {
   margin: 0 0 18px;
   color: #334155;
   font-size: 13px;
   font-weight: 700;
   letter-spacing: 0.08em;
   text-transform: uppercase;
  }

  .hero-copy h1 {
   font-size: clamp(2rem, 5vw, 3.2rem);
   font-weight: 800;
   line-height: 1.15;
   margin: 0 0 20px;
   color: #111827;
  }

  .hero-text {
   color: #4b5563;
   font-size: 1.05rem;
   line-height: 1.7;
   margin: 0 0 32px;
  }

  .hero-panel {
   background: #1f2937;
   color: white;
   border-radius: 16px;
   padding: 28px;
   box-shadow: 0 24px 60px rgba(15,23,42,0.25);
  }

  .panel-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 24px;
   font-size: 14px;
   opacity: 0.8;
  }

  .panel-header strong { font-size: 16px; opacity: 1; }

  .route-line {
   display: flex;
   justify-content: space-between;
   margin-bottom: 24px;
  }

  .route-line > div {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 8px;
  }

  .route-line p {
   font-size: 12px;
   margin: 0;
   opacity: 0.7;
  }

  .dot {
   width: 14px;
   height: 14px;
   border-radius: 50%;
   background: rgba(255,255,255,0.2);
  }

  .dot.active { background: #60a5fa; }

  .metric-grid {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 12px;
  }

  .metric-grid > div {
   background: rgba(255,255,255,0.06);
   border-radius: 10px;
   padding: 12px;
  }

  .metric-grid span {
   display: block;
   font-size: 11px;
   opacity: 0.6;
   margin-bottom: 4px;
  }

  .metric-grid strong {
   font-size: 15px;
  }

  .feature-strip {
   background: #1f2937;
   padding: 60px 6vw;
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: 40px;
  }

  .feature-strip article { color: white; }

  .feature-strip span {
   display: block;
   font-size: 36px;
   font-weight: 800;
   opacity: 0.15;
   margin-bottom: 16px;
  }

  .feature-strip h3 {
   margin: 0 0 10px;
   font-size: 1.2rem;
  }

  .feature-strip p {
   opacity: 0.7;
   line-height: 1.6;
   margin: 0;
  }

  .landing-footer {
   padding: 40px 6vw;
   display: flex;
   justify-content: space-between;
   align-items: center;
   background: #f1f5f9;
   border-top: 1px solid #e2e8f0;
  }

  .landing-footer strong {
   font-size: 20px;
   font-weight: 800;
   display: block;
   margin-bottom: 6px;
   color: #1f2937;
  }

  .landing-footer p {
   color: #6b7280;
   margin: 0;
   font-size: 14px;
  }

  .footer-copy {
   color: #9ca3af !important;
   font-size: 13px !important;
  }

  @media (max-width: 900px) {
   .hero { grid-template-columns: 1fr; }
   .hero-panel { display: none; }
   .feature-strip { grid-template-columns: 1fr; }
   .landing-footer { flex-direction: column; gap: 20px; text-align: center; }
  }
 `]
})
export class LandingComponent {
 constructor(private router: Router) {}

 goToLogin() { this.router.navigate(['/login']); }
 goToRegister() { this.router.navigate(['/register']); }
}
