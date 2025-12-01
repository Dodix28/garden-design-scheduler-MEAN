import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models/user';

@Component({
  selector: 'app-vlasnik',
  templateUrl: './vlasnik.component.html',
  styleUrls: ['./vlasnik.component.css']
})
export class VlasnikComponent implements OnInit {

constructor(private router: Router){}

ngOnInit(): void {
  let k = localStorage.getItem('ulogovan');
  if(k != null){
    this.ulogovan = JSON.parse(k);
  }
}

ulogovan: Korisnik = new Korisnik();

  odjava(){
    localStorage.removeItem('ulogovan');
    this.router.navigate(['']);
  }
}
