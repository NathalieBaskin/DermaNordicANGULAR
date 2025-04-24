import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  shippingInfo = {
    name: '',
    address: '',
    city: '',
    zipCode: '',
    email: ''
  };
  paymentInfo = {
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  };
  isProcessing: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  onSubmit() {
    this.isProcessing = true;
    // Simulera betalningsprocess
    setTimeout(() => {
      const order = this.cartService.placeOrder({
        shipping: this.shippingInfo,
        payment: this.paymentInfo,
        items: this.cartItems,
        total: this.total
      });
      console.log('Order placed:', order);
      this.bookingService.clearTempBooking(); // Clear any existing booking data
      this.isProcessing = false;
      this.router.navigate(['/confirmation']);
    }, 2000); // Simulera en 2-sekunders betalningsprocess
  }
}
