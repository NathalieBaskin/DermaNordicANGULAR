import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Observable, switchMap, tap, map, of, combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product | undefined>;
  staticProducts$!: Observable<Product[]>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.product$ = this.route.params.pipe(
      map(params => +params['id']),
      switchMap(id => this.productService.getProductById(id)),
      tap(product => console.log('Produkt laddad:', product))
    );

    this.staticProducts$ = combineLatest([
      this.product$,
      this.productService.getProducts()
    ]).pipe(
      map(([currentProduct, allProducts]) => {

        const filteredProducts = allProducts.filter(p => p.id !== currentProduct?.id);
        const result = filteredProducts.slice(0, 4);
        console.log('Produkter laddade:', result);
        return result;
      })
    );
  }

  addToCart(product: Product) {
    if (product) {
      this.cartService.addToCart(product);
      console.log('Produkt tillagd i kundvagn:', product);
      alert('Product added to cart!');
    }
  }
}
