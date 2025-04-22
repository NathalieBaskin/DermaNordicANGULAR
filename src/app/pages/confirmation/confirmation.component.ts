import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Booking {
  treatmentName: string;
  treatmentPrice: string;
  date: string;
  time: string;
  therapist: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  booking: Booking | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { booking: Booking } | undefined;

    if (state && state.booking) {
      this.booking = state.booking;
    } else {
      this.router.navigate(['/']);
    }
  }
}
