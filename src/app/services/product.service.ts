import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  hoverImageUrl: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api';
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(error => {
        console.error('Fel vid hämtning av produkter:', error);
        return of([]);
      })
    ).subscribe(products => {
      this.productsSubject.next(products);
    });
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(error => {
        console.error(`Fel vid hämtning av produkt med id ${id}:`, error);
        throw error;
      })
    );
  }

  getSimilarProducts(category: string, excludeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}?excludeId=${excludeId}`).pipe(
      catchError(error => {
        console.error('Fel vid hämtning av liknande produkter:', error);
        return of([]);
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product).pipe(
      tap(newProduct => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]);
      }),
      catchError(error => {
        console.error('Fel vid tillägg av produkt:', error);
        throw error;
      })
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`).pipe(
      tap(() => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next(currentProducts.filter(p => p.id !== id));
      }),
      catchError(error => {
        console.error(`Fel vid borttagning av produkt med id ${id}:`, error);
        throw error;
      })
    );
  }
}
