import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
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
  showBookedMessage: boolean = false;
  calendarReady: boolean = false;
  isConsultation: boolean = false;
  consultationTimes: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
  consultationInfo: string = `A consultation is an important first step before any treatment. It allows us to assess your skin,
    discuss your concerns and goals, and recommend the most suitable treatments for you.
    During the consultation, we will:
    - Evaluate your skin type and condition
    - Discuss your skincare routine and lifestyle
    - Address any specific concerns you may have
    - Recommend appropriate treatments and products
    - Answer any questions you might have about our services
    This consultation is free of charge and carries no obligation. It's an opportunity for you to
    learn more about our treatments and for us to provide personalized recommendations.`;
    showBookingConfirmation: boolean = false;

   constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isConsultation = params['consultation'] === 'true';
      this.treatmentName = this.isConsultation ? 'Consultation' : (params['treatment'] || '');
      this.treatmentPrice = this.isConsultation ? 'Free' : (params['price'] || '');
    });

    this.bookingService.getFullyBookedDates().subscribe(
      dates => {
        this.fullyBookedDates = dates.map(dateString => {
          const [year, month, day] = dateString.split('-').map(Number);
          return new Date(year, month - 1, day);
        });

        this.calendarReady = true;
        this.changeDetectorRef.detectChanges();
      },
      error => console.error('Fel vid hämtning av fullbokade datum:', error)
    );
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  onDateSelect(event: Date | null) {
    if (event) {
      if (this.isDateFullyBooked(event)) {
        console.log('Försöker välja fullbokat datum:', event);
        this.showBookedMessage = true;
        setTimeout(() => {
          this.showBookedMessage = false;
          this.changeDetectorRef.detectChanges();
        }, 3000);
        this.selectedDate = null;
        this.selectedDateString = '';
      } else {
        this.showBookedMessage = false;
        this.selectedDate = new Date(event.getTime() - event.getTimezoneOffset() * 60000);
        this.selectedDateString = this.selectedDate.toISOString().split('T')[0];
        this.selectedTherapist = '';
        this.selectedTime = '';
        this.availableTimes = [];
      }
    } else {
      this.showBookedMessage = false;
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
      email: this.email,
      isConsultation: this.isConsultation
    };
    this.bookingService.saveBooking(bookingData).subscribe(
      response => {
        console.log('Booking saved successfully:', response);
        if (this.isConsultation) {
          this.showBookingConfirmation = true;
          this.changeDetectorRef.detectChanges(); // Tvinga uppdatering av vyn
          setTimeout(() => {
            this.showBookingConfirmation = false;
            this.router.navigate(['/']);
          }, 2000);
        } else {
          // Hantera vanliga behandlingsbokningar här om det behövs
        }
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
      const isBooked = this.isDateFullyBooked(cellDate);
      if (isBooked) {
        console.log(`Datum ${cellDate.toISOString().split('T')[0]} markeras som fullbokat`);
        return 'fully-booked-date';
      }
    }
    return '';
  }

  isDateFullyBooked(date: Date): boolean {
    if (!date || !this.fullyBookedDates || this.fullyBookedDates.length === 0) {
      return false;
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return this.fullyBookedDates.some(bookedDate => {
      return (
        bookedDate.getFullYear() === year &&
        bookedDate.getMonth() === month &&
        bookedDate.getDate() === day
      );
    });
  }
}
