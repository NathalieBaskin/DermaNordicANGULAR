import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Observable, switchMap, tap, map, catchError, of, combineLatest, EMPTY } from 'rxjs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product | undefined>;
  staticProducts$!: Observable<Product[]>;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {

    this.product$ = this.route.params.pipe(
      map(params => +params['id']),
      switchMap(id => {
        if (isNaN(id) || id <= 0) {

          this.router.navigate(['/webshop']);
          return EMPTY;
        }
        return this.productService.getProductById(id).pipe(
          tap(product => {
            console.log('Produkt laddad:', product);
            this.loading = false;
          }),
          catchError(error => {
            console.error('Fel vid hämtning av produkt:', error);
            this.loading = false;
            this.error = true;
            this.snackBar.open('Kunde inte ladda produkten. Försök igen senare.', 'Stäng', {
              duration: 5000
            });
            return of(undefined);
          })
        );
      })
    );


    this.staticProducts$ = combineLatest([
      this.product$,
      this.productService.getProducts().pipe(
        catchError(error => {
          console.error('Fel vid hämtning av produkter:', error);
          return of([]);
        })
      )
    ]).pipe(
      map(([currentProduct, allProducts]) => {
        if (!currentProduct || !allProducts.length) {
          return [];
        }
        const filteredProducts = allProducts.filter(p => p.id !== currentProduct.id);
        const result = filteredProducts.slice(0, 4);
        console.log('Liknande produkter laddade:', result);
        return result;
      })
    );
  }

  addToCart(product: Product) {
    if (product) {
      try {
        this.cartService.addToCart(product);
        console.log('Produkt tillagd i kundvagn:', product);
        this.snackBar.open('Added to cart!', '', {
          duration: 1000
        });
      } catch (error) {
        console.error('Fel vid tillägg i kundvagn:', error);
        this.snackBar.open('Error.', '', {
          duration: 2000
        });
      }
    }
  }
}
