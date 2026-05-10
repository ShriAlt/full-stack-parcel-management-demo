import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const token = localStorage.getItem('authToken');
 if (token) {
  req = req.clone({
   setHeaders: {
    Authorization: `Bearer ${token}`
   }
  });
 }
 return next(req);
};

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
 return next(req).pipe(
  map(event => {
   if (event instanceof HttpResponse && isApiResponse(event.body)) {
    return event.clone({ body: event.body.data });
   }
   return event;
  })
 );
};

function isApiResponse(body: unknown): body is { success: boolean; message: string; data: unknown } {
 return !!body
  && typeof body === 'object'
  && 'success' in body
  && 'message' in body
  && 'data' in body;
}
