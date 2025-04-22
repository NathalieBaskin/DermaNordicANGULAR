import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  saveBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }
  getFullyBookedDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fully-booked-dates`);
  }

  getAvailableTimes(date: Date, therapist: string): Observable<string[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<string[]>(`${this.apiUrl}/available-times`, {
      params: { date: formattedDate, therapist }
    });
  }
}
