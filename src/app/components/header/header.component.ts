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

  treatments = [
    { name: 'Basic Facial', route: '/basicfacial' },
    { name: 'Microneedling', route: '/microneedling' },
    { name: 'Plasmapen', route: '/plasmapen' },
    { name: 'Dermaplaning', route: '/dermaplaning' }
  ];

  constructor(private router: Router) {}

  handleSearch(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery.trim().toLowerCase();

    if (query !== '') {
      const matchedTreatment = this.treatments.find(treatment =>
        treatment.name.toLowerCase().includes(query)
      );

      if (matchedTreatment) {
        this.router.navigate([matchedTreatment.route]);
      } else {
        this.router.navigate(['/sok'], { queryParams: { q: query } });
      }

      this.searchQuery = '';
    }
  }
}
