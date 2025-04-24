import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="similar-products" *ngIf="similarProducts.length > 0">
      <h2>Similar Products</h2>
      <div class="product-slider">
        <div *ngFor="let product of similarProducts"
             class="similar-product-card"
             (click)="navigateToProduct(product.id)">
          <img [src]="product.hoverImageUrl" [alt]="product.name" class="product-image">
          <div class="product-info">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-price">{{ product.price | currency:'$MXN ':'symbol':'1.0-0' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./similar-products.component.css']
})
export class SimilarProductsComponent implements OnChanges {
  @Input() category: string | undefined;
  @Input() excludeId: number | undefined;
  similarProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnChanges() {
    if (this.category && this.excludeId) {
      this.productService.getSimilarProducts(this.category, this.excludeId).subscribe(products => {
        this.similarProducts = products.slice(0, 4);
        console.log('Similar products loaded:', this.similarProducts);
      });
    }
  }

  navigateToProduct(productId: number) {
    console.log('Navigating to product:', productId);
    this.router.navigate(['/product', productId]).then(() => {
      console.log('Navigation completed');
      window.scrollTo(0, 0);  // Scroll to top after navigation
    }).catch(err => console.error('Navigation failed:', err));
  }
}
