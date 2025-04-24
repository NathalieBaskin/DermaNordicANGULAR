import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showHoverEffect: boolean = true;
  isHovered: boolean = false;

  onMouseEnter() {
    if (this.showHoverEffect) {
      this.isHovered = true;
    }
  }

  onMouseLeave() {
    if (this.showHoverEffect) {
      this.isHovered = false;
    }
  }

  get displayedImage(): string {
    return this.isHovered ? this.product.imageUrl : this.product.hoverImageUrl;
  }
}
