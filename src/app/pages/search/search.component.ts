import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';



interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  hoverImageUrl: string;
  category: string;
}

interface Treatment {
  name: string;
  route: string;
  description: string;
  keywords: string[];
}

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
  products: Product[] = [];
  treatments: Treatment[] = [
    { name: 'Basic Facial', route: '/basicfacial', description: 'A deep cleansing treatment for healthy skin.', keywords: ['basic facial', 'facial'] },
    { name: 'Dermaplaning', route: '/dermaplaning', description: 'Exfoliating treatment that removes dead skin cells and fine hair.', keywords: ['dermaplaning', 'derma planing'] },
    { name: 'Microneedling', route: '/microneedling', description: 'Stimulates collagen production and improves skin texture.', keywords: ['microneedling', 'micro needling'] },
    { name: 'Plasma Pen', route: '/plasmapen', description: 'Non-surgical skin tightening and wrinkle reduction.', keywords: ['plasma pen', 'plasmapen'] },
    { name: 'Prices', route: '/prices', description: 'View our current prices and availability.', keywords: ['prices', 'price'] }
  ];

  filteredTreatments: Treatment[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.checkForExactMatch();
      this.updateFilteredResults();
    });
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.updateFilteredResults();
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

  private updateFilteredResults() {
    if (this.shouldRedirect) {
      this.filteredTreatments = [];
      this.filteredProducts = [];
      return;
    }

    const normalizedSearchTerm = this.normalizeString(this.searchTerm);
    const generalTerms = ['treatment', 'treatments', 'skin', 'beauty', 'face', 'sun', 'cream', 'serum'];

    if (generalTerms.includes(normalizedSearchTerm)) {
      this.filteredTreatments = this.treatments.filter(treatment => treatment.name !== 'Prices');
      this.filteredProducts = this.products;
    } else {
      this.filteredTreatments = this.treatments.filter(treatment => {
        if (treatment.name === 'Prices') {
          return ['price', 'prices'].includes(normalizedSearchTerm);
        }
        return this.normalizeString(treatment.name).includes(normalizedSearchTerm) ||
               treatment.keywords.some(keyword => this.normalizeString(keyword).includes(normalizedSearchTerm));
      });

      this.filteredProducts = this.products.filter(product =>
        this.normalizeString(product.name).includes(normalizedSearchTerm) ||
        this.normalizeString(product.description).includes(normalizedSearchTerm) ||
        this.normalizeString(product.category).includes(normalizedSearchTerm)
      );
    }
  }

  private normalizeString(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '');
  }
}
