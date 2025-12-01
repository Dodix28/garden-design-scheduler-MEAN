import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Korisnik } from '../models/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router){}

  ngOnInit(): void {

  }

    //login podaci
    kor_ime: string = "";
    lozinka: string = "";
    porukaLogin = "";

    login(){
      this.userService.login(this.kor_ime,this.lozinka).subscribe((korisnik: Korisnik) => {
        if(this.kor_ime == "" || this.lozinka == ""){
          this.porukaLogin = "Niste uneli sve podatke,pokusajte ponovo.";
          return;
        }
        if(!korisnik){
          this.porukaLogin = "Losi podaci, ovakav korisnik ne postoji u sistemu.";
          return;
        } else {
          this.porukaLogin = "";
          localStorage.setItem('ulogovan',JSON.stringify(korisnik));
          if(korisnik.tip == 'admin'){
            this.router.navigate(['admin'])
          } else {
            this.porukaLogin = "Greska. Moze se prijaviti samo administrator."
          }
        }
      })
    }


    changePassword(){
      this.router.navigate(['changePassword']);
    }
}
