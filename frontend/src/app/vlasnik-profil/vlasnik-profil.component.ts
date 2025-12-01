import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ZahtevService } from '../services/zahtev.service';
import { Zahtev } from '../models/zahtev';

@Component({
  selector: 'app-vlasnik-profil',
  templateUrl: './vlasnik-profil.component.html',
  styleUrls: ['./vlasnik-profil.component.css']
})
export class VlasnikProfilComponent implements OnInit{

  constructor(private userService: UserService,private router: Router, private zahtevService: ZahtevService){}

  ngOnInit(): void {
    let k = localStorage.getItem('ulogovan');
    if(k != null){
      this.ulogovan = JSON.parse(k);
    }
    this.profilImageURL = "http://localhost:4000/uploads/" + this.ulogovan.profilna;

  }

  ulogovan: Korisnik = new Korisnik();
  profilImageURL: string = "";

  //azuriranje podataka
  ime: string = "";
  prezime: string = "";
  mejl: string = "";
  adresa: string = "";
  kontakt: string = "";
  kartica: string = "";
  cardType: string = "";
  selectedFile: File | null = null;
  prikaziFormuZaAzuriranje: boolean = false;

  porukaAzuriranja: string = "";
  porukaFormatKontakt:string = "";
  porukaFormatMejl:string = "";
  porukaFormatKartica:string = "";

  toggleAzuriranjePodataka(){
    this.prikaziFormuZaAzuriranje = !this.prikaziFormuZaAzuriranje;
    this.ime ="";
    this.prezime ="";
    this.mejl ="";
    this.adresa ="";
    this.kontakt ="";
    this.kartica ="";
  }

  selectFile(event: any){
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);

    if(this.selectedFile){
        const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'png'];
        if (!validExtensions.includes(fileExtension ?? '')) {
          this.porukaAzuriranja = "Nepravilan format slike! Dozvoljeni formati su JPG i PNG.";
          return;
        }
    }

    //provera dimenzija slike
    const reader = new FileReader();
    reader.onload = (e : any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
       //console.log('Image loaded:', img); // Provera da li je slika ucitana
        console.log('Image dimensions:', img.width, img.height);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if(ctx){
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          if (canvas.width < 100 || canvas.height < 100 || canvas.width > 300 || canvas.height > 300) {
            this.porukaAzuriranja = "Slika mora biti izmedju 100x100 i 300x300 piksela.";
          } else {
            this.porukaAzuriranja = "";
          }
        } else {
          this.porukaAzuriranja = "Neuspesno dobijanje 2D konteksta canvas.";
        }

      }
      img.onerror = () => {
        console.error('Error loading image.'); // Prikazivanje greske ako slika ne moze da se ucita
      };
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error); // Prikazivanje greske ako fileReader ne moze da procita fajl
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }

  }

  formatKontakt(): boolean {
    let f =  /^[0-9]{9,10}$/;
    if(f.test(this.kontakt) == true){
      this.porukaFormatKontakt ='';
      return true;
    }
    this.porukaFormatKontakt = "Unesite ispravan broj telefona!"
    return false;
  }

  formatKartica(): boolean {
    let f = /^(300|301|302|303)\d{12}$|^(36|38)\d{13}$/; //Diners
    let g = /^(51|52|53|54|55)\d{14}$/; //MasterCard
    let h = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/; // Visa
    if(f.test(this.kartica) == true){
      this.porukaFormatKartica ="Kartica Diners";
      return true;
    }
    if(g.test(this.kartica) == true){
      this.porukaFormatKartica ="Kartica MasterCard";
      return true;
    }
    if(h.test(this.kartica) == true){
      this.porukaFormatKartica ="Kartica Visa";
      return true;
    }
    this.porukaFormatKartica = "Niste ispravo uneli podatke za karticu!"
    return false;
  }

  cardImage(){
    this.porukaFormatKartica = ""
    this.cardType = '';

    let f = /^(300|301|302|303)\d{12}$|^(36|38)\d{13}$/; //Diners
    let g = /^(51|52|53|54|55)\d{14}$/; //MasterCard
    let h = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/; // Visa

    if(f.test(this.kartica) == true){
      this.porukaFormatKartica ="Kartica Diners";
      this.cardType = 'Diners';
    }
    if(g.test(this.kartica) == true){
      this.porukaFormatKartica ="Kartica MasterCard";
      this.cardType = 'MasterCard';
    }
    if(h.test(this.kartica) == true){
      this.porukaFormatKartica ="Kartica Visa";
      this.cardType = 'Visa';
    }
  }


   //ime_korisnika@primer.com
   formatMejl(): boolean{
    let f = /^\w{3,}\@[a-zA-Z_]+\.[a-zA-Z]+$/;
    if(f.test(this.mejl) == true){
      this.porukaFormatMejl= '';
      return true;
    }
    this.porukaFormatMejl = "Email mora biti u formatu kor_ime@primer.com, pokusajte ponovo!"
    return false;
  }

  azuriraj(){
    if(this.ime == "" && this.prezime == "" && this.mejl == "" && this.adresa =="" && this.kartica =="" && this.kontakt =="" && this.selectedFile == null){
      this.porukaAzuriranja = "Niste uneli nijedan podatak";
      //this.toggleAzuriranjePodataka();
      return;
    } else {
      this.porukaAzuriranja ="";
      if((this.mejl != "" && this.formatMejl() ==false) || (this.kartica != "" && this.formatKartica() == false) || (this.kontakt != "" && this.formatKontakt()==false)){
        if(this.mejl == ""){this.porukaFormatMejl = ""}
        if(this.kartica == ""){this.porukaFormatKartica = ""}
        if(this.kontakt == ""){ this.porukaFormatKontakt = ""}
        return;
      }
      this.porukaAzuriranja ="";
      this.userService.dohvatiMejl(this.mejl).subscribe((k: Korisnik) =>{
        this.zahtevService.dohvatiMejl(this.mejl).subscribe((z:Zahtev) => {
          if( k!= null || z!= null){
            this.porukaAzuriranja = "Nalog sa ovom majl adresom vec postoji!";
            return;
          }
        })
      })
      this.porukaAzuriranja ="";
      this.userService.azurirajPodatke(this.ulogovan.kor_ime,this.ime,this.prezime,this.mejl,this.kontakt,this.adresa,this.kartica)
      .subscribe((u: Korisnik) => {
        if(u != null){
          this.toggleAzuriranjePodataka();
          this.ulogovan = u;
          localStorage.removeItem('ulogovan');
          localStorage.setItem('ulogovan', JSON.stringify(this.ulogovan));
          alert('Podaci su izmenjeni!');

          if(this.selectedFile != null){
            this.userService.azurirajProfilnu(this.ulogovan.kor_ime,this.selectedFile).subscribe((user: Korisnik) => {
              if(user != null){
                this.ulogovan = user;
                this.profilImageURL = "http://localhost:4000/uploads/" + this.ulogovan.profilna;
                localStorage.removeItem('ulogovan');
                localStorage.setItem('ulogovan', JSON.stringify(user));
                this.selectedFile = null;
                alert('Podaci su izmenjeni i izmenjena fotografija');
              } else {
                alert('GRESKA pri izmeni fotografije.')
              }
            })
          }

        } else {
          alert("Podaci nisu izmenjeni, greska");
        }
      })
    }


  }



}
