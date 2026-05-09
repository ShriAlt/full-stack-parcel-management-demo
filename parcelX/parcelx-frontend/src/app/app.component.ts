import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
 selector: 'app-root',
 standalone: true,
 imports: [CommonModule, RouterOutlet],
 template: `<router-outlet></router-outlet>`,
 styles: []
})
export class AppComponent {
 constructor(private router: Router) {}
}


