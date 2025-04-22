import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

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
    private bookingService: BookingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.treatmentName = params['treatment'] || '';
      this.treatmentPrice = params['price'] || '';
    });

    this.bookingService.getFullyBookedDates().subscribe(
      dates => {
        this.fullyBookedDates = dates.map(dateString => {
          const date = new Date(dateString);
          return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        });
        this.changeDetectorRef.detectChanges();
      },
      error => console.error('Error fetching fully booked dates:', error)
    );
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !this.isDateFullyBooked(date);
  }

  onDateSelect(event: Date | null) {
    if (event && !this.isDateFullyBooked(event)) {
      this.selectedDate = new Date(event.getTime() - event.getTimezoneOffset() * 60000);
      this.selectedDateString = this.selectedDate.toISOString().split('T')[0];
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
      const dateString = this.selectedDate.toISOString().split('T')[0];
      this.bookingService.getAvailableTimes(new Date(dateString), this.selectedTherapist).subscribe(
        times => {
          this.availableTimes = times.map(time => ({ time, isBooked: false }));
        },
        error => {
          console.error('Error fetching available times:', error);
          this.availableTimes = [];
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

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const classes = [];
      if (this.isDateFullyBooked(cellDate)) {
        classes.push('fully-booked-date');
      }
      return classes.join(' ');
    }
    return '';
  }
  addTooltip = (date: Date): string => {
    return this.isDateFullyBooked(date) ? 'Fully booked' : '';
  }

  isDateFullyBooked(date: Date): boolean {
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return this.fullyBookedDates.some(bookedDate => {
      const adjustedBookedDate = new Date(bookedDate.getTime() - bookedDate.getTimezoneOffset() * 60000);
      return adjustedBookedDate.toISOString().split('T')[0] === adjustedDate.toISOString().split('T')[0];
    });
  }
}
