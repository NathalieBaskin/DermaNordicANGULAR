import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dermaplaning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dermaplaning.component.html',
  styleUrls: ['./dermaplaning.component.css']
})
export class DermaplaningComponent implements OnInit {
  treatmentName: string = 'Dermaplaning';
  treatmentImage: string = '/assets/images/dermaplaning.png';
  treatmentDescription: string = 'Dermaplaning is a non-invasive exfoliation treatment that removes dead skin cells and fine facial hair (peach fuzz) using a sterile surgical scalpel. This procedure helps to create a smoother, brighter complexion and allows skincare products to penetrate more effectively.';
  treatmentBenefits: string[] = [
    'Removes dead skin cells for a fresh, glowing complexion',
    'Eliminates fine facial hair for smoother skin',
    'Enhances the absorption of skincare products',
    'Provides a flawless base for makeup application',
    'Safe for most skin types, with no downtime'
  ];
  treatmentProcedure: string = 'The treatment takes approximately 30–45 minutes. A skincare professional will gently glide a sterile scalpel across the skin at a 45-degree angle, removing dead skin and peach fuzz. The procedure is painless and requires no recovery time.';
  treatmentAftercare: string[] = [
    'Apply sunscreen daily, as your skin will be more sensitive to UV rays',
    'Avoid harsh exfoliants for at least 48 hours',
    'Keep skin moisturized to maintain hydration'
  ];
  treatmentPrice: string = '$800 MXN';

  constructor() {}

  ngOnInit() {}

  bookTreatment() {
    console.log('Booking treatment:', this.treatmentName);
  }
}
