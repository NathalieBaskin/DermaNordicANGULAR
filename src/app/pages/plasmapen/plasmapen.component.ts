import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plasmapen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plasmapen.component.html',
  styleUrls: ['./plasmapen.component.css']
})
export class PlasmapenComponent implements OnInit {
  treatmentName: string = 'Plasmapen';
  treatmentImage: string = '/assets/images/plasmapen.jpg';
  treatmentDescription: string = 'Plasma Pen is a non-surgical skin tightening treatment that uses plasma energy to create micro-injuries, triggering collagen and elastin production for a firmer, youthful appearance.';
  treatmentBenefits: string[] = [
    'Tightens and lifts sagging skin',
    'Reduces wrinkles and fine lines',
    'Improves skin texture and elasticity',
    'Minimizes acne scars and blemishes',
    'Long-lasting, natural-looking results'
  ];
  treatmentProcedure: string = 'A numbing cream is applied to ensure comfort during the procedure. The Plasma Pen device releases plasma energy to create tiny controlled micro-injuries in the skin. These micro-injuries stimulate the skin’s natural healing response, increasing collagen production. The treatment typically takes 30–60 minutes, depending on the area being treated.'
  treatmentAftercare: string[] = [
    'Expect some redness and swelling for a few days',
    'Avoid picking or scratching the treated area',
    'Apply a soothing cream as recommended by your specialist',
    'Avoid direct sun exposure and apply sunscreen',
    'Drink plenty of water to aid skin healing'
  ];
  treatmentPrice: string = '$1500 MXN';

  constructor() {}

  ngOnInit() {}

  bookTreatment() {
    console.log('Booking treatment:', this.treatmentName);
  }
}
