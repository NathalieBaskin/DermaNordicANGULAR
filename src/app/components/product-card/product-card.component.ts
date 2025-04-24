import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card" [routerLink]="['/product', product.id]">
      <img [src]="product.hoverImageUrl" [alt]="product.name" class="product-image">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency:'$MXN ':'symbol':'1.0-0' }}</p>
    </div>
  `,
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
}
