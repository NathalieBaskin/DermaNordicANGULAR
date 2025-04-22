import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getAvailableTimes(date: string, therapist: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-times`, { params: { date, therapist } });
  }

  saveBooking(booking: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, booking);
  }

  getFullyBookedDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fully-booked-dates`);
  }
}
