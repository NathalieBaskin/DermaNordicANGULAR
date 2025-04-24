import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'DermaNordicMedSpa';

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.scrollToTop();
    });
  }

  ngAfterViewInit() {
    this.scrollToTop();
  }

  private scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);

    // Fallback om ViewportScroller inte fungerar
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // Extra fallback för komplexa layouts eller långsamma enheter
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }
}
