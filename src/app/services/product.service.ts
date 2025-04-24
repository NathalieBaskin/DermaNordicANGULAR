import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

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
  private products: Product[] = [
    { id: 1, name: 'Facial Cleanser', description: 'Gentle daily cleanser', price: 250, imageUrl: 'assets/products/cleanser.png', hoverImageUrl: 'assets/products/cleanser-product.jpg', category: 'Skin' },
    { id: 2, name: 'Moisturizer', description: 'Hydrating face cream', price: 350, imageUrl: 'assets/products/moisturizer.png', hoverImageUrl: 'assets/products/moisturizer-product.jpg', category: 'Skin' },
    { id: 3, name: 'Sunscreen', description: 'SPF 50 protection', price: 200, imageUrl: 'assets/products/sunscreen-product.jpeg', hoverImageUrl: 'assets/products/sunscreen.jpg', category: 'Skin' },
    { id: 4, name: 'Serum', description: 'Anti-aging formula', price: 450, imageUrl: 'assets/products/serum-product.png', hoverImageUrl: 'assets/products/serum.jpg', category: 'Skin' },
    { id: 5, name: 'Eye Cream', description: 'Reduces dark circles', price: 300, imageUrl: 'assets/products/eyecream-product.png', hoverImageUrl: 'assets/products/eyecream.jpg', category: 'Skin' },
    { id: 6, name: 'Face Mask', description: 'Hydrating sheet mask', price: 50, imageUrl: 'assets/products/facemask-product.png', hoverImageUrl: 'assets/products/facemask.jpeg', category: 'Skin' },
    { id: 7, name: 'Toner', description: 'Balancing toner', price: 180, imageUrl: 'assets/products/toner-product.png', hoverImageUrl: 'assets/products/toner.jpg', category: 'Skin' },
    { id: 8, name: 'Exfoliator', description: 'Gentle scrub', price: 220, imageUrl: 'assets/products/exfoliator-product.png', hoverImageUrl: 'assets/products/exfoliator.jpg', category: 'Skin' }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  getSimilarProducts(category: string, excludeId: number): Observable<Product[]> {
    const similarProducts = this.products.filter(p => p.category === category && p.id !== excludeId);
    return of(similarProducts);
  }
}
