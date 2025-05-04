import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    hoverImageUrl: '',
    category: ''
  };
  private productSubscription: Subscription = new Subscription();
  isSubmitting: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productSubscription = this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  addProduct() {
    if (!this.newProduct.category) {
      console.error('Kategori krävs');
      return;
    }

    this.isSubmitting = true;

    this.productService.addProduct(this.newProduct).subscribe(
      (addedProduct) => {
        console.log('Produkt tillagd:', addedProduct);
        this.resetNewProduct();
        this.isSubmitting = false;

        // Visa bekräftelsemeddelande
        alert('Produkten har lagts till framgångsrikt!');

        // Navigera till webshop-sidan
        this.router.navigate(['/webshop']);
      },
      (error) => {
        console.error('Fel vid tillägg av produkt:', error);
        this.isSubmitting = false;
        alert('Ett fel uppstod när produkten skulle läggas till. Försök igen.');
      }
    );
  }

  deleteProduct(id: number) {
    if (confirm('Är du säker på att du vill ta bort denna produkt?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          console.log('Produkt borttagen');

          // Visa bekräftelsemeddelande
          alert('Produkten har tagits bort framgångsrikt!');

          // Navigera till webshop-sidan
          this.router.navigate(['/webshop']);
        },
        (error) => {
          console.error('Fel vid borttagning av produkt:', error);
          alert('Ett fel uppstod när produkten skulle tas bort. Försök igen.');
        }
      );
    }
  }

  resetNewProduct() {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      hoverImageUrl: '',
      category: ''
    };
  }

  onFileSelected(event: any, imageType: 'main' | 'hover') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (imageType === 'main') {
          this.newProduct.imageUrl = e.target.result;
        } else {
          this.newProduct.hoverImageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
