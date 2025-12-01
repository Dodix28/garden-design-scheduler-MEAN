import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VlasnikProfilComponent } from './vlasnik-profil/vlasnik-profil.component';
import { VlasnikFirmeComponent } from './vlasnik-firme/vlasnik-firme.component';
import { VlasnikZakazivanjComponent } from './vlasnik-zakazivanj/vlasnik-zakazivanj.component';
import { VlasnikOdrzavanjeComponent } from './vlasnik-odrzavanje/vlasnik-odrzavanje.component';
import { FirmaComponent } from './firma/firma.component';
import { DekoraterZakazivanjaComponent } from './dekorater-zakazivanja/dekorater-zakazivanja.component';
import { DekoraterOdrzavanjaComponent } from './dekorater-odrzavanja/dekorater-odrzavanja.component';
import { DekoraterStatistikaComponent } from './dekorater-statistika/dekorater-statistika.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:"vlasnik", component: VlasnikComponent, children: [
    {path: '', redirectTo: 'vlasnikProfil', pathMatch: 'full'},
    {path: "vlasnikProfil" , component: VlasnikProfilComponent},
    {path: "vlasnikFirma", component: VlasnikFirmeComponent },
    {path: 'vlasnikZakazivanja', component: VlasnikZakazivanjComponent},
    {path: 'vlasnikOdrzavanje', component: VlasnikOdrzavanjeComponent}
  ]},
  {path:"dekorater", component: DekoraterComponent, children: [
    {path: '', redirectTo: 'vlasnikProfil', pathMatch: 'full'},
    {path: "vlasnikProfil" , component: VlasnikProfilComponent},
    {path: "dekoraterZakazivanja", component:DekoraterZakazivanjaComponent},
    {path: "dekoraterOdrzavanja", component: DekoraterOdrzavanjaComponent},
    {path: "dekoraterStatistika", component: DekoraterStatistikaComponent}
  ]},
  {path:"adminLogin", component: AdminLoginComponent},
  {path: "admin", component: AdminComponent},
  {path: "changePassword", component: ChangePasswordComponent},
  {path: "firma", component: FirmaComponent, children: [
    {path: '', component: CanvasComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
