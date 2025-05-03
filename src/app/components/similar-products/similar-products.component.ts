import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-similar-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.css']
})
export class SimilarProductsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() category: string | undefined;
  @Input() excludeId: number | undefined;
  similarProducts: Product[] = [];
  private productSubscription: Subscription | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    console.log('SimilarProductsComponent initialized');
    this.loadSimilarProducts();
    this.subscribeToProductChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges called', changes);
    if (changes['category'] || changes['excludeId']) {
      this.loadSimilarProducts();
    }
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  private subscribeToProductChanges() {
    this.productSubscription = this.productService.getProducts().subscribe(() => {
      this.loadSimilarProducts();
    });
  }

  loadSimilarProducts() {
    console.log('loadSimilarProducts called. Category:', this.category, 'Exclude ID:', this.excludeId);
    if (this.category && this.excludeId !== undefined) {
      this.productService.getSimilarProducts(this.category, this.excludeId).subscribe(
        products => {
          this.similarProducts = products.slice(0, 4);
          console.log('Similar products loaded:', this.similarProducts);
        },
        error => console.error('Error loading similar products:', error)
      );
    } else {
      console.log('Cannot load similar products: category or excludeId is undefined');
    }
  }
}
