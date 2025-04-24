import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="similar-products" *ngIf="similarProducts.length > 0">
      <h2>Similar Products</h2>
      <div class="product-slider">
        <app-product-card *ngFor="let product of similarProducts" [product]="product" [showHoverEffect]="false"></app-product-card>
      </div>
    </div>
  `,
  styleUrls: ['./similar-products.component.css']
})
export class SimilarProductsComponent implements OnChanges {
  @Input() category: string | undefined;
  @Input() excludeId: number | undefined;
  similarProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnChanges() {
    if (this.category && this.excludeId) {
      this.productService.getSimilarProducts(this.category, this.excludeId).subscribe(products => {
        this.similarProducts = products.slice(0, 4).map(product => ({
          ...product,
          imageUrl: product.hoverImageUrl // Use hoverImageUrl as the main image
        }));
      });
    }
  }
}
