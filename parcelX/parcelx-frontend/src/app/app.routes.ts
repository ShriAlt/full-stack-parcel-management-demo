import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { UserDashboardComponent } from './dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { BookParcelComponent } from './parcel/book-parcel.component';
import { TrackParcelComponent } from './parcel/track-parcel.component';
import { ManageOrdersComponent } from './parcel/manage-orders.component';
import { UserProfileComponent } from './dashboard/user-profile.component';
import { PaymentComponent } from './payment/payment.component';
import { LandingComponent } from './landing/landing.component';
import { UserRole } from './core/user-role';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
 { path: '', component: LandingComponent },
 { path: 'login', component: LoginComponent },
 { path: 'register', component: RegisterComponent },
 { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [authGuard], data: { roles: [UserRole.USER] } },
 { path: 'user/book-parcel', component: BookParcelComponent, canActivate: [authGuard], data: { roles: [UserRole.USER] } },
 { path: 'user/track-parcel', component: TrackParcelComponent, canActivate: [authGuard], data: { roles: [UserRole.USER, UserRole.ADMIN] } },
 { path: 'user/manage-orders', component: ManageOrdersComponent, canActivate: [authGuard], data: { roles: [UserRole.USER] } },
 { path: 'user/profile', component: UserProfileComponent, canActivate: [authGuard], data: { roles: [UserRole.USER] } },
 { path: 'payment/new', component: PaymentComponent, canActivate: [authGuard], data: { roles: [UserRole.USER] } },
 { path: 'payment/:id', component: PaymentComponent, canActivate: [authGuard], data: { roles: [UserRole.USER] } },
 { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { roles: [UserRole.ADMIN] } },
 { path: '**', redirectTo: '' }
];


