import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  treatmentName: string = '';
  treatmentPrice: string = '';
  selectedDate: Date | null = null;
  selectedDateString: string = '';
  selectedTherapist: string = '';
  selectedTime: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';

  therapists: string[] = ['Sebastian', 'Jhoselin'];
  availableTimes: TimeSlot[] = [];
  fullyBookedDates: Date[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.treatmentName = params['treatment'] || '';
      this.treatmentPrice = params['price'] || '';
    });
    this.getFullyBookedDates();
  }

  getFullyBookedDates() {
    this.bookingService.getFullyBookedDates().subscribe(
      dates => {
        this.fullyBookedDates = dates.map(date => new Date(date));
      },
      error => {
        console.error('Error fetching fully booked dates:', error);
      }
    );
  }

  onDateSelect(event: Date | null) {
    if (event) {
      this.selectedDate = event;
      this.selectedDateString = event.toISOString().split('T')[0];
      this.selectedTherapist = '';
      this.selectedTime = '';
      this.availableTimes = [];
    } else {
      this.selectedDate = null;
      this.selectedDateString = '';
      this.selectedTherapist = '';
      this.selectedTime = '';
      this.availableTimes = [];
    }
  }

  onTherapistSelect() {
    if (this.selectedDate && this.selectedTherapist) {
      this.getAvailableTimes();
    }
  }

  getAvailableTimes() {
    if (this.selectedDate && this.selectedTherapist) {
      this.bookingService.getAvailableTimes(this.selectedDate, this.selectedTherapist).subscribe(
        times => {
          this.availableTimes = times.map(time => ({ time, isBooked: false }));
        },
        error => {
          console.error('Error fetching available times:', error);
        }
      );
    }
  }

  onSubmit() {
    const bookingData = {
      treatmentName: this.treatmentName,
      treatmentPrice: this.treatmentPrice,
      date: this.selectedDateString,
      time: this.selectedTime,
      therapist: this.selectedTherapist,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
    this.bookingService.saveBooking(bookingData).subscribe(
      response => {
        console.log('Booking saved successfully:', response);
        // Här kan du lägga till logik för att navigera till en bekräftelsesida
      },
      error => {
        console.error('Error saving booking:', error);
      }
    );
  }

  isFormValid(): boolean {
    return !!this.selectedDate &&
           !!this.selectedTherapist &&
           !!this.selectedTime &&
           !!this.firstName &&
           !!this.lastName &&
           !!this.email;
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !this.isDateFullyBooked(date);
  }

  dateClass = (date: Date): string => {
    return this.isDateFullyBooked(date) ? 'fully-booked' : '';
  }

  isDateFullyBooked(date: Date): boolean {
    return this.fullyBookedDates.some(bookedDate =>
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
  }
}
