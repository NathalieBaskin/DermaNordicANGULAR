import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  bookingData: any;
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  nameOnCard: string = '';
  paymentOption: 'card' | 'onsite' = 'card';

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit() {
    console.log('PaymentComponent initialized');
    this.bookingData = this.bookingService.getTempBooking();

    if (!this.bookingData) {
      this.router.navigate(['/booking']);
    }
  }

  selectPaymentOption(option: 'card' | 'onsite') {
    this.paymentOption = option;
  }

  processPayment() {
    if (this.isPaymentFormValid()) {
      console.log('Processing card payment for:', this.bookingData);
      this.saveBookingAndNavigate();
    } else {
      console.error('Payment form is not valid');
      // Show error message to user
    }
  }

  confirmOnsitePayment() {
    console.log('Confirming on-site payment for:', this.bookingData);
    this.saveBookingAndNavigate();
  }

  private saveBookingAndNavigate() {
    this.bookingService.saveBooking(this.bookingData).subscribe(
      response => {
        console.log('Booking saved:', response);
        this.router.navigate(['/confirmation']);
      },
      error => {
        console.error('Error saving booking:', error);
        // Handle error (e.g., show error message)
      }
    );
  }

  isPaymentFormValid(): boolean {
    return this.cardNumber.length === 16 &&
           this.expiryDate.length === 5 &&
           this.cvv.length === 3 &&
           this.nameOnCard.length > 0;
  }
}
