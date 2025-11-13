import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CarouselModule } from 'ngx-bootstrap/carousel';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './nav/nav.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FooterComponent } from './footer/footer.component';

// Import the Http Module and our Data Service
import {HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './interceptors';

import { LocationsService } from './services/locations.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlightSalesComponent } from './flight-sales/flight-sales.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SearchSliderComponent } from './search-slider/search-slider.component';
import { FlightSaleComponent } from './flight-sale/flight-sale.component';
import { FlightSearchResultsComponent } from './flight-search-results/flight-search-results.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FlightSearchResultsListComponent } from './flight-search-results-list/flight-search-results-list.component';
import { FlightSearchResultsHeaderComponent } from './flight-search-results-header/flight-search-results-header.component';
import { FlightSearchResultsListItemComponent } from './flight-search-results-list-item/flight-search-results-list-item.component';
import { FlightOrderComponent } from './flight-order/flight-order.component';
import { FlightOrderHeaderComponent } from './flight-order-header/flight-order-header.component';
import { FlightOrderDetailsComponent } from './flight-order-details/flight-order-details.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ConfirmationHeaderComponent } from './confirmation/confirmation-header/confirmation-header.component';
import { ConfirmationDetailsComponent } from './confirmation/confirmation-details/confirmation-details.component';
import { LoginComponent } from './login/login/login.component';
import { LoginDetailsComponent } from './login/login-details/login-details.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

//Jwt auth module
import { JwtModule  } from '@auth0/angular-jwt';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AdminComponent } from './administrator/admin.component';
import { RolesComponent } from './administrator/roles/roles/roles.component';
import { UsersComponent } from './administrator/users/users/users.component';
import { LocationsComponent } from './administrator/locations/locations/locations.component';
import { FlightsComponent } from './administrator/flights/flights/flights.component';
import { OrdersComponent } from './administrator/orders/orders/orders.component';
import { DashboardComponent } from './administrator/dashboard/dashboard/dashboard.component';
import { RegisterComponent } from './administrator/users/register/register.component';
import { AlertComponent } from './administrator/alert/alert.component';
import { UserModalComponent } from './administrator/users/user-modal/user-modal.component';
import { UserDeleteModalComponent } from './administrator/users/user-delete-modal/user-delete-modal.component';
import { FlightEditModalComponent } from './administrator/flights/flight-edit-modal/flight-edit-modal.component';
import { FlightDeleteModalComponent } from './administrator/flights/flight-delete-modal/flight-delete-modal.component';
import { LtDragDirective } from './directives/lt-drag.directive';
import { LocationEditModalComponent } from './administrator/locations/location-edit-modal/location-edit-modal.component';
import { LocationDeleteModalComponent } from './administrator/locations/location-delete-modal/location-delete-modal.component';
import { OrdersEditModalComponent } from './administrator/orders/orders-edit-modal/orders-edit-modal.component';
import { OrdersDeleteModalComponent } from './administrator/orders/orders-delete-modal/orders-delete-modal.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CombinationsListComponent } from './administrator/flightCombinations/combinations-list/combinations-list.component';
import { CombinationsEditModalComponent } from './administrator/flightCombinations/combinations-edit-modal/combinations-edit-modal.component';
import { CombinationsDeleteModalComponent } from './administrator/flightCombinations/combinations-delete-modal/combinations-delete-modal.component';
import { ClientSummaryComponent } from './components/client-summary/client-summary.component';
import { ClientPaymentComponent } from './components/client-payment/client-payment.component';
import { ClientResultsComponent } from './components/client-results/client-results.component';
import { SalePageComponent } from './components/sale-page/sale-page.component';
import { SalePageHeaderComponent } from './components/sale-page/sale-page-header/sale-page-header.component';
import { SalePageSelectPassengersComponent } from './components/sale-page/sale-page-select-passengers/sale-page-select-passengers.component';
import { AirlinesComponent } from './administrator/airlines/airlines.component';
import { AirlineDeleteModalComponent } from './administrator/airlines/airline-delete-modal/airline-delete-modal.component';
import { AirlineEditModalComponent } from './administrator/airlines/airline-edit-modal/airline-edit-modal.component';
import { LegalComponent } from './legal/legal.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { environment } from 'src/environments/environment';



//import { AdminRoutingModule } from './administrator/admin-routing.module';

export function tokenGetter() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if(currentUser){
    return currentUser.token
  } 
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FlightSearchComponent,
    FooterComponent,
    FlightSalesComponent,
    LandingPageComponent,
    AboutComponent,
    ContactComponent,
    SearchSliderComponent,
    FlightSaleComponent,
    FlightSearchResultsComponent,   
    FlightSearchResultsListComponent,
    FlightSearchResultsHeaderComponent,    
    FlightSearchResultsListItemComponent,
    FlightOrderComponent,
    FlightOrderHeaderComponent,
    FlightOrderDetailsComponent,
    ConfirmationComponent,
    ConfirmationHeaderComponent,
    ConfirmationDetailsComponent,
    LoginComponent,
    LoginDetailsComponent,
    AdminComponent,    
    RolesComponent,
    UsersComponent,
    LocationsComponent,
    FlightsComponent,
    OrdersComponent,
    DashboardComponent,
    RegisterComponent,
    AlertComponent,
    UserModalComponent,
    UserDeleteModalComponent,
    FlightEditModalComponent,
    FlightDeleteModalComponent,
    LtDragDirective,
    LocationEditModalComponent,
    LocationDeleteModalComponent,    
    OrdersEditModalComponent, 
    OrdersDeleteModalComponent,
    SearchBarComponent, 
    CombinationsListComponent, 
    CombinationsEditModalComponent, 
    CombinationsDeleteModalComponent, 
    ClientSummaryComponent, 
    ClientPaymentComponent, 
    ClientResultsComponent, 
    SalePageComponent, 
    SalePageHeaderComponent, 
    SalePageSelectPassengersComponent, 
    AirlinesComponent,
    AirlineDeleteModalComponent,
    AirlineEditModalComponent,
    LegalComponent,
    PrivacyComponent,    
      
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule ,    
    CarouselModule.forRoot() ,
    Ng4LoadingSpinnerModule.forRoot(),
    LoggerModule.forRoot({
      // serverLoggingUrl: (environment.production ? "" : "http://localhost:4200") + '/api/logs',
      level: !environment.production ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.OFF,      
      serverLogLevel: NgxLoggerLevel.OFF}),    
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['checkintravel.co.il','localhost:3000','localhost:4200','localhost:8080'],
        //blacklistedRoutes: ['example.com/examplebadroute/']
      }
    }),
    FlashMessagesModule.forRoot(),    
  ],
  providers: [
    // { 
    //   provide: APP_BASE_HREF, 
    //   useValue: '/' + (window.location.pathname.split('/')[1] || '')
    // },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    LocationsService
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UserModalComponent,
    UserDeleteModalComponent,
    FlightEditModalComponent,
    FlightDeleteModalComponent,
    LocationEditModalComponent,
    LocationDeleteModalComponent,
    OrdersEditModalComponent, OrdersDeleteModalComponent,
    CombinationsEditModalComponent,CombinationsDeleteModalComponent,
    AirlineEditModalComponent,AirlineDeleteModalComponent,
    
  ]
})
export class AppModule { }
