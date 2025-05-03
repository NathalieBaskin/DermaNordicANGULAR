import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SimilarProductsComponent } from '../../components/similar-products/similar-products.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, SimilarProductsComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  private productSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  loadProduct(id: number) {
    console.log('Loading product with id:', id);
    this.productSubscription = this.productService.getProductById(id).subscribe(
      product => {
        this.product = product;
        console.log('Loaded product:', product);
        if (!product) {
          console.error('Product not found');
        }
      },
      error => console.error('Error loading product:', error)
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
