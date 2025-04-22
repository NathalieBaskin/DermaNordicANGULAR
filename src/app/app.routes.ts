import { Routes } from '@angular/router';
import { StartsidaComponent } from './pages/startsida.component';
import { DermaplaningComponent } from './pages/dermaplaning/dermaplaning.component';
import { BasicfacialComponent} from './pages/basicfacial/basicfacial.component';
import { MicroneedlingComponent } from './pages/microneedling/microneedling.component';
import { PlasmapenComponent } from './pages/plasmapen/plasmapen.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';

export const routes: Routes = [
  { path: '', component: StartsidaComponent },
  { path: 'dermaplaning', component: DermaplaningComponent },
  { path: 'basicfacial', component: BasicfacialComponent},
  { path: 'microneedling', component: MicroneedlingComponent},
  { path: 'plasmapen', component: PlasmapenComponent},
  { path: 'booking', component: BookingComponent},
  { path: 'confirmation', component: ConfirmationComponent },
];
