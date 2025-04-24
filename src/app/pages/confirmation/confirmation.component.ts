import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  bookingData: any;
  orderData: any;
  isBooking: boolean = false;
  isOrder: boolean = false;

  constructor(
    private bookingService: BookingService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.bookingData = this.bookingService.getTempBooking();
    if (this.bookingData) {
      this.isBooking = true;
    } else {
      this.orderData = this.cartService.getLastOrder();
      if (this.orderData) {
        this.isOrder = true;
      }
    }
  }
}
