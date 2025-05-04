import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:3000/api/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe(
      products => {
        this.productsSubject.next(products);
      },
      error => {
        console.error('Fel vid hämtning av produkter:', error);
      }
    );
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getSimilarProducts(category: string, excludeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}?excludeId=${excludeId}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() => this.loadProducts())
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadProducts())
    );
  }
}
