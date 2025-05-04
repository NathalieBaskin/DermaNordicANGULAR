import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.css']
})
export class SimilarProductsComponent implements OnChanges {
  @Input() category: string | undefined;
  @Input() excludeId: number | undefined;
  similarProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.loadSimilarProducts();
  }

  loadSimilarProducts() {
    if (this.category && this.excludeId) {
      this.productService.getSimilarProducts(this.category, this.excludeId).subscribe(products => {
        this.similarProducts = products.slice(0, 4); // Begränsa till 4 liknande produkter
        console.log('Liknande produkter laddade:', this.similarProducts);
      });
    }
  }
}
