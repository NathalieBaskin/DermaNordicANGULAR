import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SimilarProductsComponent } from '../../components/similar-products/similar-products.component';

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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
    });
  }
  addToCart(product: Product) {
    if (product) {
      this.cartService.addToCart(product);
      console.log('Product added to cart:', product);
    }
  }
}
