import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  shouldRedirect: boolean = false;
  redirectUrl: string = '';
treatments = [
  { name: 'Basic Facial', route: '/basicfacial', description: 'A deep cleansing treatment for healthy skin.', keywords: ['basic facial', 'facial'] },
  { name: 'Dermaplaning', route: '/dermaplaning', description: 'Exfoliating treatment that removes dead skin cells and fine hair.', keywords: ['dermaplaning', 'derma planing'] },
  { name: 'Microneedling', route: '/microneedling', description: 'Stimulates collagen production and improves skin texture.', keywords: ['microneedling', 'micro needling'] },
  { name: 'Plasma Pen', route: '/plasmapen', description: 'Non-surgical skin tightening and wrinkle reduction.', keywords: ['plasma pen', 'plasmapen'] },
  { name: 'Prices', route: '/prices', description: 'View our current prices and availability.', keywords: ['prices', 'price'] }
];

constructor(private route: ActivatedRoute, private router: Router) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.searchTerm = params['q'] || '';
    this.checkForExactMatch();
  });
}

private checkForExactMatch() {
  const normalizedSearchTerm = this.normalizeString(this.searchTerm);
  const exactMatch = this.treatments.find(treatment =>
    treatment.keywords.some(keyword => this.normalizeString(keyword) === normalizedSearchTerm) ||
    this.normalizeString(treatment.name) === normalizedSearchTerm
  );

  if (exactMatch) {
    this.shouldRedirect = true;
    this.redirectUrl = exactMatch.route;
    this.router.navigateByUrl(this.redirectUrl);
  } else {
    this.shouldRedirect = false;
  }
}

get filteredResults() {
  if (this.shouldRedirect) {
    return [];
  }

  const normalizedSearchTerm = this.normalizeString(this.searchTerm);
  const generalTerms = ['treatment', 'treatments', 'skin', 'beauty'];

  if (generalTerms.includes(normalizedSearchTerm)) {
    return this.treatments.filter(treatment => treatment.name !== 'Prices');
  }

  return this.treatments.filter(treatment => {
    if (treatment.name === 'Prices') {
      return ['price', 'prices'].includes(normalizedSearchTerm);
    }
    return this.normalizeString(treatment.name).includes(normalizedSearchTerm) ||
           treatment.keywords.some(keyword => this.normalizeString(keyword).includes(normalizedSearchTerm));
  });
}
private normalizeString(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '');
}
}
