import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  logoPath: string = '/assets/images/logo.JPG';
  searchQuery: string = '';

  constructor(private router: Router) {}

  handleSearch(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery.trim();

    if (query !== '') {
      this.router.navigate(['/sok'], { queryParams: { q: query } });
      this.searchQuery = '';
    }
  }
}
