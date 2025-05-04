import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartUpdateSubject = new Subject<void>();
  private lastOrder: any = null;

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartItems = JSON.parse(cart);
      this.cartSubject.next([...this.cartItems]);
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    // Skicka en kopia av arrayen för att säkerställa att prenumeranter får uppdateringen
    this.cartSubject.next([...this.cartItems]);
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Metod för att lyssna på uppdateringar av varukorgen
  getCartUpdates(): Observable<void> {
    return this.cartUpdateSubject.asObservable();
  }

  addToCart(product: Product) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ ...product, quantity: 1 });
    }
    this.saveCart();
    // Meddela att varukorgen har uppdaterats
    this.cartUpdateSubject.next();
    console.log('Cart updated:', this.cartItems);
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCart();
    // Meddela att varukorgen har uppdaterats
    this.cartUpdateSubject.next();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
      // Meddela att varukorgen har uppdaterats
      this.cartUpdateSubject.next();
    }
  }

  getTotal() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  placeOrder(shippingInfo: any) {
    const order = {
      items: this.cartItems,
      total: this.getTotal(),
      shippingInfo: shippingInfo,
      date: new Date()
    };
    this.lastOrder = order;
    this.clearCart();
    return order;
  }

  getLastOrder() {
    return this.lastOrder;
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    // Meddela att varukorgen har uppdaterats
    this.cartUpdateSubject.next();
  }
}
