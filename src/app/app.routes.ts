import { Routes } from '@angular/router';
import { StartsidaComponent } from './pages/startsida/startsida.component';
import { DermaplaningComponent } from './pages/dermaplaning/dermaplaning.component';
import { BasicfacialComponent} from './pages/basicfacial/basicfacial.component';
import { MicroneedlingComponent } from './pages/microneedling/microneedling.component';
import { PlasmapenComponent } from './pages/plasmapen/plasmapen.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { SearchComponent } from './pages/search/search.component';
import { PricesComponent } from './pages/prices/prices.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { WebshopComponent } from './pages/webshop/webshop.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: StartsidaComponent },
  { path: 'dermaplaning', component: DermaplaningComponent },
  { path: 'basicfacial', component: BasicfacialComponent},
  { path: 'microneedling', component: MicroneedlingComponent},
  { path: 'plasmapen', component: PlasmapenComponent},
  { path: 'booking', component: BookingComponent},
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'sok', component: SearchComponent },
  { path: 'prices', component: PricesComponent},
  { path: 'payment', component: PaymentComponent },
  { path: 'webshop', component: WebshopComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminComponent }
];
