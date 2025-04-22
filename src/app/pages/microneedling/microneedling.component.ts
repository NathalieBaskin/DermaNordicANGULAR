import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-microneedling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './microneedling.component.html',
  styleUrls: ['./microneedling.component.css']
})
export class MicroneedlingComponent implements OnInit {
  constructor(private router: Router) {}
  treatmentName: string = 'Microneedling';
  treatmentImage: string = '/assets/images/microneedling.webp';
  treatmentDescription: string = 'Microneedling is a minimally invasive skin treatment that uses tiny needles to create micro-injuries in the skin, stimulating collagen production and improving skin texture.';
  treatmentBenefits: string[] = [
    'Reduces fine lines and wrinkles',
    'Improves skin texture and tone',
    'Minimizes scars, including acne scars',
    'Enhances skin firmness and elasticity',
    'Boosts collagen and elastin production'
  ];
  treatmentProcedure: string = 'Numbing cream is applied to the skin to ensure comfort during treatment. A microneedling device is gently moved across the skin, creating tiny micro-injuries. These micro-injuries trigger the bodys natural healing process, boosting collagen production. A hydrating serum or growth factor is applied to enhance results.'
  treatmentAftercare: string[] = [
    'Avoid direct sun exposure for at least 48 hours',
    'Use a gentle cleanser and moisturizer',
    'Apply sunscreen daily to protect the skin',
    'Refrain from using makeup for 24 hours',
    'Stay hydrated to aid the healing process'
  ];
  treatmentPrice: string = '$1200 MXN';

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
