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

  treatments: { name: string, price: string }[] = [
    { name: 'Dermaplaning', price: '$800 MXN' },
    { name: 'Microneedling', price: '$1000 MXN' },
    { name: 'Basic Facial', price: '$600 MXN' },
    { name: 'Plasma Pen', price: '$1200 MXN' },
    { name: 'Consultation', price: 'Free' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['consultation'] === 'true') {
        this.treatmentName = 'Consultation';
        this.treatmentPrice = 'Free';
        this.isConsultation = true;
      } else if (params['treatment']) {
        this.treatmentName = params['treatment'];
        this.treatmentPrice = params['price'] || this.getTreatmentPrice(this.treatmentName);
        this.isConsultation = this.treatmentName.toLowerCase() === 'consultation';
      } else {
        this.treatmentName = '';
        this.treatmentPrice = '';
        this.isConsultation = false;
      }
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
      error => console.error('Error fetching fully booked dates:', error)
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

  onTreatmentSelect() {
    if (this.treatmentName) {
      this.treatmentPrice = this.getTreatmentPrice(this.treatmentName);
      this.isConsultation = this.treatmentName.toLowerCase() === 'consultation';
    } else {
      this.treatmentPrice = '';
      this.isConsultation = false;
    }
  }

  getTreatmentPrice(treatmentName: string): string {
    const treatment = this.treatments.find(t => t.name === treatmentName);
    return treatment ? treatment.price : '';
  }

  onSubmit() {
    const bookingData = {
      treatmentName: this.treatmentName,
      treatmentPrice: this.treatmentPrice,
      date: this.selectedDate,
      time: this.selectedTime,
      therapist: this.selectedTherapist,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };

    if (this.treatmentName.toLowerCase() === 'consultation') {
      this.bookingService.saveBooking(bookingData).subscribe(
        response => {
          console.log('Consultation booked:', response);
          this.showBookingConfirmation = true;
          setTimeout(() => {
            this.showBookingConfirmation = false;
            this.router.navigate(['/']);
          }, 3000);
        },
        error => {
          console.error('Error booking consultation:', error);
        }
      );
    } else {
      this.bookingService.setTempBooking(bookingData);
      this.router.navigate(['/payment']);
    }
  }

  isFormValid(): boolean {
    return !!this.selectedDate &&
           !!this.selectedTherapist &&
           !!this.selectedTime &&
           !!this.firstName &&
           !!this.lastName &&
           !!this.email &&
           (this.isConsultation || !!this.treatmentName);
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const isBooked = this.isDateFullyBooked(cellDate);
      return isBooked ? 'fully-booked-date' : '';
    }
    return '';
  }

  isDateFullyBooked(date: Date): boolean {
    return this.fullyBookedDates.some(bookedDate =>
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
  }
}
