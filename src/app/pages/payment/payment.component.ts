import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  bookingData: any;

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.bookingData = navigation?.extras.state?.['bookingData'];

    if (!this.bookingData) {
      this.router.navigate(['/booking']);
    }
  }

  processPayment() {
    // Här skulle du normalt integrera med en betalningslösning
    // För detta exempel simulerar vi en lyckad betalning
    console.log('Bearbetar betalning för:', this.bookingData);

    // Spara bokningen efter lyckad betalning
    this.bookingService.saveBooking(this.bookingData).subscribe(
      response => {
        console.log('Bokning sparad efter betalning:', response);
        this.router.navigate(['/confirmation']);
      },
      error => {
        console.error('Fel vid sparande av bokning efter betalning:', error);
        // Hantera felet (visa meddelande till användaren, etc.)
      }
    );
  }
}
