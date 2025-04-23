import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  treatments = [
    { name: 'Basic Facial', route: '/basicfacial', description: 'A deep cleansing treatment for healthy skin.', keywords: ['basic facial', 'facial'] },
    { name: 'Dermaplaning', route: '/dermaplaning', description: 'Exfoliating treatment that removes dead skin cells and fine hair.', keywords: ['dermaplaning', 'derma planing'] },
    { name: 'Microneedling', route: '/microneedling', description: 'Stimulates collagen production and improves skin texture.', keywords: ['microneedling', 'micro needling'] },
    { name: 'Plasma Pen', route: '/plasmapen', description: 'Non-surgical skin tightening and wrinkle reduction.', keywords: ['plasma pen', 'plasmapen'] }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
    });
  }

  get filteredResults() {
    const normalizedSearchTerm = this.normalizeString(this.searchTerm);
    const generalTerms = ['treatment', 'treatments', 'skin', 'beauty'];

    if (generalTerms.includes(normalizedSearchTerm)) {
      return this.treatments;
    }

    return this.treatments.filter(treatment =>
      this.normalizeString(treatment.name).includes(normalizedSearchTerm) ||
      treatment.keywords.some(keyword => this.normalizeString(keyword).includes(normalizedSearchTerm))
    );
  }

  private normalizeString(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '');
  }
}
