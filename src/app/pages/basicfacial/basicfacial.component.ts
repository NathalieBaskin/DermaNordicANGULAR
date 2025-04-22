import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basicfacial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basicfacial.component.html',
  styleUrls: ['./basicfacial.component.css']
})
export class BasicfacialComponent implements OnInit {
  constructor(private router: Router) {}
  treatmentName: string = 'Basic Facial';
  treatmentImage: string = '/assets/images/facial.jpg';
  treatmentDescription: string = 'A basic facial is a deep cleansing treatment designed to remove dirt, oil, and dead skin cells from the skin. It includes gentle exfoliation, steaming, and a hydrating mask to leave the skin feeling refreshed and revitalized.';
  treatmentBenefits: string[] = [
    'Removes dirt, oil, and dead skin cells',
    'Hydrates and nourishes the skin',
    'Helps unclog pores and prevent breakouts',
    'Improves circulation for a healthy glow',
    'Relaxing and stress-reducing experience'
  ];
  treatmentProcedure: string = 'The facial begins with a gentle cleansing to remove impurities, Exfoliation helps to slough off dead skin cells, followed by steaming to open up pores. A hydrating mask is applied to restore moisture and nourish the skin. The treatment finishes with a soothing moisturizer and sunscreen application.'
  treatmentAftercare: string[] = [
    'Avoid heavy makeup for at least 24 hours',
    'Drink plenty of water to keep the skin hydrated',
    'Apply sunscreen to protect the skin from UV damage',
    'Use gentle skincare products to maintain the facial benefits'
  ];
  treatmentPrice: string = '$600 MXN';

  ngOnInit() {}

  bookTreatment() {
    this.router.navigate(['/booking'], {
      queryParams: {
        treatment: this.treatmentName,
        price: this.treatmentPrice
      }
    });
  }
}
