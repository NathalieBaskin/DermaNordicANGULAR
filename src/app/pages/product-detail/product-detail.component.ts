import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  staticProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
      this.loadStaticProducts();
    });
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(
      product => {
        this.product = product;
        console.log('Produkt laddad:', this.product);
      },
      error => console.error('Fel vid laddning av produkt:', error)
    );
  }

  loadStaticProducts() {
    this.productService.getProducts().subscribe(
      products => {
        // Filtrera bort den aktuella produkten och ta de första 4
        const filteredProducts = products.filter(p => p.id !== this.product?.id);
        this.staticProducts = filteredProducts.slice(0, 4);
        console.log('Statiska produkter laddade:', this.staticProducts);
      },
      error => console.error('Fel vid laddning av statiska produkter:', error)
    );
  }

  addToCart(product: Product) {
    if (product) {
      this.cartService.addToCart(product);
      console.log('Produkt tillagd i kundvagn:', product);
      // Visa eventuellt en bekräftelse för användaren
      alert('Produkt tillagd i kundvagnen!');
    }
  }
}
