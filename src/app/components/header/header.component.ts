import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../services/cart.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('cartBump', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('bump', style({
        transform: 'scale(1.25)'
      })),
      transition('normal <=> bump', animate('300ms ease-in-out'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  logoPath: string = '/assets/images/logo.JPG';
  searchTerm: string = '';
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faShoppingCart = faShoppingCart;
  cartItemCount: number = 0;
  cartAnimationState: string = 'normal';

  constructor(
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Hämta initialt antal varor i varukorgen
    this.updateCartCount();

    // Lyssna på händelser när produkter läggs till i varukorgen
    this.cartService.getCartUpdates().subscribe(() => {
      this.updateCartCount();
      this.triggerCartAnimation();
      // Tvinga uppdatering av vyn
      this.cdr.detectChanges();
    });
  }

  // Metod för att uppdatera räknaren
  updateCartCount() {
    this.cartService.getCart().subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
      // Tvinga uppdatering av vyn
      this.cdr.detectChanges();
    });
  }

  triggerCartAnimation() {
    this.cartAnimationState = 'bump';
    setTimeout(() => {
      this.cartAnimationState = 'normal';
      // Tvinga uppdatering av vyn
      this.cdr.detectChanges();
    }, 300);
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/sok'], { queryParams: { q: this.searchTerm } }).then(() => {
        this.searchTerm = ''; // Clear the search term after navigation
      });
    }
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }
}
