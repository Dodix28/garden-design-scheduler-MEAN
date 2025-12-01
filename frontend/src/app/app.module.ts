import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VlasnikProfilComponent } from './vlasnik-profil/vlasnik-profil.component';
import { VlasnikFirmeComponent } from './vlasnik-firme/vlasnik-firme.component';
import { VlasnikZakazivanjComponent } from './vlasnik-zakazivanj/vlasnik-zakazivanj.component';
import { VlasnikOdrzavanjeComponent } from './vlasnik-odrzavanje/vlasnik-odrzavanje.component';
import { FirmaComponent } from './firma/firma.component';
import { DekoraterZakazivanjaComponent } from './dekorater-zakazivanja/dekorater-zakazivanja.component';
import { DekoraterOdrzavanjaComponent } from './dekorater-odrzavanja/dekorater-odrzavanja.component';
import { DekoraterStatistikaComponent } from './dekorater-statistika/dekorater-statistika.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper'; // Import za Stepper
import { MatInputModule } from '@angular/material/input'; // Za input polja
import { MatFormFieldModule } from '@angular/material/form-field'; // Za form fields
import { MatButtonModule } from '@angular/material/button'; // Za dugmiće
import { MatIconModule } from '@angular/material/icon'; // Za ikone (ako koristite)
import { MatDatepickerModule } from '@angular/material/datepicker'; // Za date picker
import { MatNativeDateModule } from '@angular/material/core'; // Za date picker
import { ReactiveFormsModule } from '@angular/forms'; // Za forme
import { MatRadioModule } from '@angular/material/radio';
import { CanvasComponent } from './canvas/canvas.component';
import { MapComponent } from './map/map.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    VlasnikComponent,
    DekoraterComponent,
    AdminLoginComponent,
    ChangePasswordComponent,
    VlasnikProfilComponent,
    VlasnikFirmeComponent,
    VlasnikZakazivanjComponent,
    VlasnikOdrzavanjeComponent,
    FirmaComponent,
    DekoraterZakazivanjaComponent,
    DekoraterOdrzavanjaComponent,
    DekoraterStatistikaComponent,
    CanvasComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatStepperModule,        // Stepper modul
    MatInputModule,          // Input polja
    MatFormFieldModule,      // Form fields
    MatButtonModule,         // Dugmad
    MatIconModule,           // Ikone
    MatDatepickerModule,     // Date picker
    MatNativeDateModule,     // Native date format
    ReactiveFormsModule,     // Reactive forms
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
