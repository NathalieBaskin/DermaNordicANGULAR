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
    // Hämta några statiska produkter som alltid visas som "liknande produkter"
    this.productService.getProducts().subscribe(
      products => {
        // Ta de första 4 produkterna (eller färre om det finns färre)
        this.staticProducts = products.slice(0, 4);
      },
      error => console.error('Fel vid laddning av statiska produkter:', error)
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    console.log('Produkt tillagd i kundvagn:', product);
  }
}
