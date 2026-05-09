import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) =>{
 const router = inject(Router);

 if (!localStorage.getItem('authToken')) {
 router.navigate(['/login']);
 return false;
 }

 const requiredRoles = route.data['roles'] as string[];
 if (requiredRoles && requiredRoles.length >0) {
 const userRole = localStorage.getItem('userRole');
 if (!userRole || !requiredRoles.includes(userRole)) {
 router.navigate(['/login']);
 return false;
 }
 }

 return true;
};


