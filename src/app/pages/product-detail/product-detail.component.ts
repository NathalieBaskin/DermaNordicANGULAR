import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SimilarProductsComponent } from '../../components/similar-products/similar-products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, SimilarProductsComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;


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
  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(
      product => {
        this.product = product;
        console.log('Product loaded:', this.product);
      },
      error => console.error('Error loading product:', error)
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    console.log('Product added to cart:', product);
  }
}
