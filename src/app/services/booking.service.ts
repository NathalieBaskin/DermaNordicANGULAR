import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

export interface TimeSlot {
  time: string;
  isBooked: boolean;
}

export interface AvailableTimesResponse {
  available: string[];
  booked: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api';
  private tempBookingData: any;

  // Standardtider för alla behandlingar om API inte svarar
  private defaultTimes: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  constructor(private http: HttpClient) {}

  setTempBooking(data: any) {
    this.tempBookingData = data;
  }

  getTempBooking() {
    return this.tempBookingData;
  }

  clearTempBooking() {
    this.tempBookingData = null;
  }

  saveBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }

  getFullyBookedDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fully-booked-dates`).pipe(
      tap(dates => console.log('API response (fully booked dates):', dates)),
      catchError(error => {
        console.error('Error fetching fully booked dates:', error);
        return of([]);  // Returnera en tom array om det blir fel
      })
    );
  }

  getAvailableTimes(date: Date, therapist: string): Observable<TimeSlot[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<AvailableTimesResponse>(`${this.apiUrl}/available-times`, {
      params: { date: formattedDate, therapist }
    }).pipe(
      map(response => {
        console.log('API response:', response);

        // Create a set of booked times for quick lookup
        const bookedSet = new Set(response.booked);

        // Combine available and booked times into TimeSlot objects
        const allTimeSlots = this.defaultTimes.map(time => ({
          time,
          isBooked: bookedSet.has(time)
        }));

        return allTimeSlots;
      }),
      catchError(error => {
        console.error('Error fetching available times:', error);
        // Return default times if API call fails
        return of(this.defaultTimes.map(time => ({
          time,
          isBooked: false
        })));
      }),
      tap(timeSlots => console.log('Processed time slots:', timeSlots))
    );
  }
  }
