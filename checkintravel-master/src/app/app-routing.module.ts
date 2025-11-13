import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component'
import { AboutComponent } from './about/about.component'
import { ContactComponent } from './contact/contact.component';
import { FlightSearchResultsComponent } from './flight-search-results/flight-search-results.component';
import { FlightOrderComponent } from './flight-order/flight-order.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { LoginComponent } from './login/login/login.component';
import { DashboardComponent } from './administrator/dashboard/dashboard/dashboard.component';
import { RolesComponent } from './administrator/roles/roles/roles.component';
import { UsersComponent } from './administrator/users/users/users.component';
import { LocationsComponent } from './administrator/locations/locations/locations.component';
import { FlightsComponent } from './administrator/flights/flights/flights.component';
import { OrdersComponent } from './administrator/orders/orders/orders.component';
import { RegisterComponent } from './administrator/users/register/register.component';
import { AdminComponent } from './administrator/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './models/role';
import { CombinationsListComponent } from './administrator/flightCombinations/combinations-list/combinations-list.component';
import { SalePageComponent } from './components/sale-page/sale-page.component';
import { AirlinesComponent } from './administrator/airlines/airlines.component';
import { LegalComponent } from './legal/legal.component';
import { PrivacyComponent } from './privacy/privacy.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'results', component: FlightSearchResultsComponent },  
  { path: 'sale-passengers', component: SalePageComponent},
  { path: 'order', component: FlightOrderComponent },
  { path: 'confirmation', component: ConfirmationComponent },  
  { path: 'login', component: LoginComponent },
  {
    path: 'administrator',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
    children: [
      // { path: '', component: DashboardComponent, outlet: 'admin' },
      { path: '', component: CombinationsListComponent, outlet: 'admin' },
      { path: 'roles', component: RolesComponent, outlet: 'admin' },
      {
        path: 'users',
        component: UsersComponent,
        outlet: 'admin'        
      },
      { path: 'register', component: RegisterComponent, outlet: 'admin' },
      { path: 'locations', component: LocationsComponent, outlet: 'admin' },
      { path: 'flights', component: FlightsComponent, outlet: 'admin' },
      { path: 'flightCombinations', component: CombinationsListComponent, outlet: 'admin' },
      { path: 'airlines', component: AirlinesComponent, outlet: 'admin' },
      { path: 'orders', component: OrdersComponent, outlet: 'admin' },
      // { path:'**', redirectTo :'dashboard',pathMatch: 'full'},
    ]
  },

  //{ path: 'administrator',component: }
  // { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
