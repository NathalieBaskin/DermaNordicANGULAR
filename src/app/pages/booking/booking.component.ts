import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

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
  selectedTherapist: string = '';
  selectedTime: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';

  therapists: string[] = ['Sebastian', 'Jhoselin'];
  availableTimes: string[] = [];

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
  }

  onDateSelect(event: any) {
    this.selectedDate = event;
    this.getAvailableTimes();
  }
  getAvailableTimes() {
    if (this.selectedDate) {
      const dateString = this.selectedDate.toISOString().split('T')[0];
      this.bookingService.getAvailableTimes(dateString).subscribe(
        (response: any) => {
          this.availableTimes = response.availableTimes;
        },
        (error) => {
          console.error('Error fetching available times:', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      const booking = {
        treatmentName: this.treatmentName,
        treatmentPrice: this.treatmentPrice,
        date: this.selectedDate?.toISOString().split('T')[0],
        time: this.selectedTime,
        therapist: this.selectedTherapist,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
      };

      this.bookingService.saveBooking(booking).subscribe(
        (response) => {
          console.log('Booking saved successfully:', response);
          this.router.navigate(['/confirmation']);
        },
        (error) => {
          console.error('Error saving booking:', error);
        }
      );
    }
  }

  isFormValid(): boolean {
    return !!(this.selectedDate && this.selectedTherapist && this.selectedTime &&
      this.firstName && this.lastName && this.email);
  }
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate: Date, view: 'month' | 'year' | 'multi-year') => {
    // Här kan du lägga till logik för att markera datum som är tillgängliga eller inte
    return '';
  }
}
