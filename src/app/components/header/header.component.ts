import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  logoPath: string = '/assets/images/logo.JPG';
  searchTerm: string = '';
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faShoppingCart = faShoppingCart;

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/sok'], { queryParams: { q: this.searchTerm } });
    }
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }
}
