import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

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
    MatInputModule,
    MatTooltipModule
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
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.treatmentName = params['treatment'] || '';
      this.treatmentPrice = params['price'] || '';
    });
    this.getFullyBookedDates();
    console.log('Component initialized');
  }

  getFullyBookedDates() {
    this.bookingService.getFullyBookedDates().subscribe({
      next: (dates: string[]) => {
        this.fullyBookedDates = dates.map(date => new Date(date));
      },
      error: (error) => console.error('Error fetching fully booked dates:', error)
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return !this.fullyBookedDates.some(bookedDate =>
      bookedDate.getDate() === date.getDate() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getFullYear() === date.getFullYear()
    );
  }

  dateClass = (date: Date): string => {
    if (this.fullyBookedDates.some(bookedDate =>
      bookedDate.getDate() === date.getDate() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getFullYear() === date.getFullYear()
    )) {
      return 'fully-booked';
    }
    return '';
  }

  onDateSelect(event: Date | null) {
    if (event) {
      this.selectedDate = event;
      this.selectedDateString = this.selectedDate.toISOString().split('T')[0];
      this.selectedTherapist = '';
      this.selectedTime = '';
      this.availableTimes = [];
      console.log('Date selected:', this.selectedDateString);
    }
  }

  onTherapistSelect() {
    console.log('Therapist selected:', this.selectedTherapist);
    this.selectedTime = '';
    this.getAvailableTimes();
  }

  getAvailableTimes() {
    if (this.selectedDate && this.selectedTherapist) {
      console.log('Fetching available times for:', this.selectedDateString, this.selectedTherapist);
      this.bookingService.getAvailableTimes(this.selectedDateString, this.selectedTherapist).subscribe({
        next: (response: any) => {
          console.log('Response from server:', response);
          this.availableTimes = response.availableTimes.map((time: string) => ({
            time: time,
            isBooked: response.bookedTimes ? response.bookedTimes.includes(time) : false
          }));
          console.log('Mapped availableTimes:', this.availableTimes);
        },
        error: (error) => {
          console.error('Error fetching available times:', error);
          this.availableTimes = [];
        }
      });
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      const booking = {
        treatmentName: this.treatmentName,
        treatmentPrice: this.treatmentPrice,
        date: this.selectedDateString,
        time: this.selectedTime,
        therapist: this.selectedTherapist,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
      };

      console.log('Submitting booking:', booking);
      this.bookingService.saveBooking(booking).subscribe({
        next: (response) => {
          console.log('Booking saved successfully:', response);
          this.router.navigate(['/confirmation'], { state: { booking: booking } });
        },
        error: (error) => {
          console.error('Error saving booking:', error);
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(this.selectedDate && this.selectedTherapist && this.selectedTime &&
      this.firstName && this.lastName && this.email && this.treatmentName && this.treatmentPrice);
  }
}
