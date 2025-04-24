import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api';
  private tempBookingData: any;

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
      tap(dates => console.log('API response (fully booked dates):', dates))
    );
  }

  getAvailableTimes(date: Date, therapist: string): Observable<string[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<string[]>(`${this.apiUrl}/available-times`, {
      params: { date: formattedDate, therapist }
    });
  }
}
