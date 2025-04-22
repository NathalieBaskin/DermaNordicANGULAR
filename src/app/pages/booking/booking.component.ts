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
  showBookedMessage: boolean = false;
  calendarReady: boolean = false;


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
          const [year, month, day] = dateString.split('-').map(Number);
          return new Date(year, month - 1, day);
        });

        // Flagga som gör att kalendern renderas först efter att datumen laddats
        this.calendarReady = true;

        // Säkerställ att vyer uppdateras
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

        // Visa meddelandet
        this.showBookedMessage = true;

        // Dölj meddelandet efter 3 sekunder
        setTimeout(() => {
          this.showBookedMessage = false;
          this.changeDetectorRef.detectChanges();
        }, 3000);

        // Återställ valet
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
      // Kontrollera om datumet är fullbokat
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

    // Förenkla jämförelsen genom att bara jämföra år, månad och dag
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
