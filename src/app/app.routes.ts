import { Routes } from '@angular/router';
import { StartsidaComponent } from './pages/startsida.component';
import { DermaplaningComponent } from './pages/dermaplaning/dermaplaning.component';
import { Basicfacialomponent} from './pages/basicfacial/basicfacial.component';
import { MicroneedlingComponent } from './pages/microneedling/microneedling.component';
import { PlasmapenComponent } from './pages/plasmapen/plasmapen.component';

export const routes: Routes = [
  { path: '', component: StartsidaComponent },
  { path: 'dermaplaning', component: DermaplaningComponent },
  { path: 'basicfacial', component: Basicfacialomponent},
  { path: 'microneedling', component: MicroneedlingComponent},
  { path: 'plasmapen', component: PlasmapenComponent},
];
