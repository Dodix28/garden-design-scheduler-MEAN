import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Korisnik } from '../models/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{

  constructor(private router: Router, private userService: UserService){}

  ngOnInit(): void {

  }

  staraLozinka: string= "";
  novaLozinka1: string = "";
  novaLozinka2: string = "";
  kor_ime: string = "";

  porukaGreske: string = "";
  porukaFormat: string ="";

  formatLozinka(): boolean {
    let f = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z][A-Za-z\d!@#$%^&*]{5,9}$/;

    if(f.test(this.novaLozinka1) == true ){
      this.porukaFormat = "";
      return true;
    }
    this.porukaFormat = "Lozinka mora imati 1 veliko slovo,3 mala i specijalan karakter. Minimum 6 i max 10 karaktera. Unesite ponovo!"
    return false;
  }

  azurirajLozinku(){
    if(this.kor_ime == "" || this.novaLozinka1 == "" || this.staraLozinka == "" || this.novaLozinka2 == ""){
      this.porukaGreske = "Niste uneli sve podatke!";
      return;
    }
    if(this.novaLozinka1 != this.novaLozinka2){
      this.porukaGreske = "Niste ponovili istu novu lozinku,pokusajte ponovo";
      return;
    }
    this.porukaGreske = "";
    if(this.formatLozinka()){
      this.userService.dohvatiLozinku(this.kor_ime,this.staraLozinka).subscribe((k: Korisnik) => {
        if(k!=null){
          this.porukaGreske= "";
          this.userService.azurirajLozinku(this.kor_ime,this.novaLozinka1).subscribe((u: Korisnik) => {
            if(u != null){
              alert("Uspesno ste promenili lozinku!");
              if(u.tip == "admin"){
                this.router.navigate(['adminLogin']);
              } else {
                this.router.navigate(['']);
              }
            }  else {
              alert ("Greska, lozinka nije promenjena");
            }
          })
        } else {
          this.porukaGreske = "Neispravno korisnicko ime ili lozinka, pokusajte ponovo"
        }
      })
    }

  }



}
