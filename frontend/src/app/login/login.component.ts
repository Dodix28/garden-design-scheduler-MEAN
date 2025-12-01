import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ZahtevService } from '../services/zahtev.service';
import { Router } from '@angular/router';
import { Korisnik } from '../models/user';
import { Zahtev } from '../models/zahtev';
import { Firma } from '../models/firma';
import { FirmaService } from '../services/firma.service';
import { Zakazivanje } from '../models/zakazivanje';
import { ZakazivanjeService } from '../services/zakazivanje.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private userService: UserService,private zahtevService: ZahtevService,private router: Router,private firmaService: FirmaService,
    private zakazivanjeService: ZakazivanjeService
  ){}

ngOnInit(): void {
  this.userService.dohvatiSveVlasnike().subscribe((k:Korisnik[]) => {
    if(k != null){
      this.sviVlasnici = k;
    }
  })
  this.userService.dohvatiSveDekoratere().subscribe((k: Korisnik[]) => {
    if(k!= null){
      this.sviDekorateri = k;
    }
  })
  this.firmaService.dohvatiSveFirme().subscribe((f: Firma[]) => {
    if(f != null){
      this.sveFirme = f;
      this.prikazaneFirme = f;
    }
  })
  this.zakazivanjeService.dohvatiSvaZavrsenaZakazivanja().subscribe((z:Zakazivanje[]) => {
    this.zavrseniPoslovi = z;
  })

  this.zakazivanjeService.getPrihvacenoZavrsenoNaCekanju().subscribe((z: Zakazivanje[]) => {
    this.infoZakazivanje = z;
   z.forEach((zakazivanje: Zakazivanje) => {
    this.datumi.push(zakazivanje.datumZakazivanja);
   })
    console.log('ZAKAZIVANJE',z)
    this.filtrirajZakazivanjePoslednjihMesecDana();
      this.filtrirajZakazivanjePoslednjih7Dana();
      this.filtrirajZakazivanjePoslednjih24h();
      console.log('THIS.DATUMI',this.datumi)
      console.log('24',this.zak24)
      console.log('7',this.zakSedamDana)
      console.log('30',this.zakMesecDana)
  })
}

  //login podaci
  kor_ime: string = "";
  lozinka: string = "";
  porukaLogin = "";

  //registracija podaci
  kor_ime_reg: string = "";
  lozinka_reg: string = "";
  ime_reg: string = "";
  prezime_reg: string = "";
  pol_reg: string = "";
  adresa_reg: string = "";
  kontakt_reg: string = "";
  mejl_reg: string = "";
  kartica_reg: string = "";
  cardType: string = "";
  selectedFile: File | null = null;
  errorMessage: string= '';

  porukaReg: string = "";
  porukaLozinka: string = "";
  porukaMejl: string = "";
  porukaKontakt: string = "";
  porukaKartica: string = "";

  //podaci o korisnicima
  sviVlasnici: Korisnik[] = [];
  sviDekorateri: Korisnik[] = [];
  sveFirme: Firma[] = [];
  prikazaneFirme: Firma[] = [];
  zavrseniPoslovi: Zakazivanje[] = [];

  //sort
  sortOption: string = "";
  porukaGreske: string = "";
  pretraga:string ="";

  //INFO //poslovi na cekanju i prihvaceni
infoZakazivanje: Zakazivanje[] = [];
zak24: Zakazivanje[]=[];
h24br: number = 0;
sedambr=0;
mesecbr = 0;
zakSedamDana: Zakazivanje[]=[];
zakMesecDana: Zakazivanje[]=[];
datumi: string[]= [];

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
        if(korisnik.tip == 'dekorater'){
          this.router.navigate(['dekorater'])
        } else if(korisnik.tip == 'vlasnik'){
          this.router.navigate(['vlasnik'])
        } else {
          this.porukaLogin = "Admin se mora ulogovati preko zasebne forme."
        }
      }
    })
  }

  //kontakt moze imati 9 ili 10 cifata
  formatKontakt(): boolean {
    let f =  /^[0-9]{9,10}$/;
    if(f.test(this.kontakt_reg) == true){
      this.porukaKontakt ='';
      return true;
    }
    this.porukaKontakt = "Unesite ispravan broj telefona!"
    return false;
  }

  //ime_korisnika@primer.com
  formatMejl(): boolean{
    let f = /^\w{3,}\@[a-zA-Z_]+\.[a-zA-Z]+$/;
    if(f.test(this.mejl_reg) == true){
      this.porukaMejl= '';
      return true;
    }
    this.porukaMejl = "Email mora biti u formatu kor_ime@primer.com, pokusajte ponovo!"
    return false;
  }

  formatKartica(): boolean {
    let f = /^(300|301|302|303)\d{12}$|^(36|38)\d{13}$/; //Diners
    let g = /^(51|52|53|54|55)\d{14}$/; //MasterCard
    let h = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/; // Visa
    if(f.test(this.kartica_reg) == true){
      this.porukaKartica ="Kartica Diners";
      return true;
    }
    if(g.test(this.kartica_reg) == true){
      this.porukaKartica ="Kartica MasterCard";
      return true;
    }
    if(h.test(this.kartica_reg) == true){
      this.porukaKartica ="Kartica Visa";
      return true;
    }
    this.porukaKartica = "Niste ispravo uneli podatke za karticu!"
    this.cardType = ''; // nema ikonice za nevalidan broj kartice
    return false;
  }

  cardImage(){
    this.porukaKartica = ""
    this.cardType = '';

    let f = /^(300|301|302|303)\d{12}$|^(36|38)\d{13}$/; //Diners
    let g = /^(51|52|53|54|55)\d{14}$/; //MasterCard
    let h = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/; // Visa

    if(f.test(this.kartica_reg) == true){
      this.porukaKartica ="Kartica Diners";
      this.cardType = 'Diners';
    }
    if(g.test(this.kartica_reg) == true){
      this.porukaKartica ="Kartica MasterCard";
      this.cardType = 'MasterCard';
    }
    if(h.test(this.kartica_reg) == true){
      this.porukaKartica ="Kartica Visa";
      this.cardType = 'Visa';
    }
  }


  formatLozinka(): boolean {
    let f = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z][A-Za-z\d!@#$%^&*]{5,9}$/;
    if(f.test(this.lozinka_reg) == true ){
      this.porukaLozinka = "";
      return true;
    }
    this.porukaLozinka = "Lozinka mora imati 1 veliko slovo,3 mala i specijalan karakter. Minimum 6 i max 10 karaktera. Mora poceti slovom. Unesite ponovo!"
    return false;

  }

  selectFile(event: any){
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);

    if(this.selectedFile){
      
        const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'png'];
        if (!validExtensions.includes(fileExtension ?? '')) {
          this.porukaReg = "Nepravilan format slike! Dozvoljeni formati su JPG i PNG.";
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
            this.porukaReg = "Slika mora biti izmedju 100x100 i 300x300 piksela.";
          } else {
            this.porukaReg = "";
          }
        } else {
          this.porukaReg = "Neuspesno dobijanje 2D konteksta za canvas.";
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


  //provera da li se mejl i korisnicko ime vec koriste
  //provera ispravnosti formata unetih podataka
  registracija(){
    if(this.kor_ime_reg == "" || this.lozinka_reg == "" || this.ime_reg == "" || this.prezime_reg =="" || this.pol_reg ==""
      || this.adresa_reg == "" || this.kontakt_reg == "" || this.mejl_reg =="" || this.kartica_reg == ""){
      this.porukaReg = "Niste uneli sve podatke!";
      return;
    }

    this.userService.dohvatiKorIme(this.kor_ime_reg).subscribe((k: Korisnik) => {
      this.zahtevService.dohvatiKorIme(this.kor_ime_reg).subscribe((z: Zahtev) => {
        if(k != null || z != null){
          this.porukaReg = "Korisnicko ime je zauzeto!"
          return;
        } else {
          this.userService.dohvatiMejl(this.mejl_reg).subscribe((kor: Korisnik) => {
            this.zahtevService.dohvatiMejl(this.mejl_reg).subscribe((zah: Zahtev) => {
              if(kor != null || zah != null){
                this.porukaReg = "Vec postoji nalog sa ovom email adresom!"
                return
              } else {
                this.porukaReg = "";
                if(this.formatKartica() && this.formatKontakt() && this.formatLozinka() && this.formatMejl()){
                  this.zahtevService.dodajZahtev(this.ime_reg,this.prezime_reg,this.kor_ime_reg,this.lozinka_reg,this.mejl_reg,this.pol_reg,this.adresa_reg,this.kontakt_reg,this.kartica_reg)
                  .subscribe((r: Zahtev) => {
                    if(r != null) {

                      if(this.selectedFile != null) {
                        this.zahtevService.dodajProfilnu(this.kor_ime_reg,this.selectedFile).subscribe((zahtev: Zahtev) => {
                          if(zahtev != null) {
                            alert("Uspesno se uploadovali fotografiju.")
                          } else {
                            alert("GRESKA pri uploadu fotografije!")
                          }
                        })
                      }
                      alert("Uspesno ste poslali zahtev.")
                    } else {
                      alert("GRESKA pri slanju zahteva.")
                    }
                  })
                }
              }
            })
          })
        }
      })
    })
  }

  changePassword(){
    this.router.navigate(['changePassword']);
  }

   /*---------------------------pretraga------------------------------ */
   pretrazi(){
    this.filtriraj();
   }

   filtriraj(){
    this.prikazaneFirme = this.sveFirme.filter
    (firma =>
      firma.naziv.toLowerCase().includes(this.pretraga.toLocaleLowerCase()) ||
      firma.adresa.toLowerCase().includes(this.pretraga.toLowerCase()));
   }

   prikaziSve(){
    this.prikazaneFirme = this.sveFirme;
   }


  /*----------------------------sortiranje---------------------------- */
  sortiraj(){
    if(this.sortOption == ""){
      this.porukaGreske = "Niste odabrali parametar za sortiranje!"
      return
    }
    this.porukaGreske ="";
    switch(this.sortOption){
      case 'nazivRastuce':
        this.sortirajNazivRastuce();
        break;
      case 'nazivOpadajuce':
        this.sortirajNazivOpadajuce();
        break;
      case 'adresaRastuce':
        this.sortirajAdresaRastuce();
        break;
      case 'adresaOpadajuce':
        this.sortirajAdresaOpadajuce();
        break;
      default:
        break;
    }
  }
  sortirajNazivRastuce(){
    this.sveFirme.sort((a,b) => {
      if(a.naziv < b.naziv){
        return -1;
      } else if(a.naziv > b.naziv) {
        return 1;
      } else return 0;
    })
  }
  sortirajNazivOpadajuce(){
    this.sveFirme.sort((a,b) => {
      if(a.naziv < b.naziv){
        return 1;
      } else if(a.naziv > b.naziv) {
        return -1;
      } else return 0;
    })
  }

  sortirajAdresaRastuce(){
    this.sveFirme.sort((a,b) => {
      if(a.adresa < b.adresa){
        return -1;
      } else if(a.adresa > b.adresa) {
        return 1;
      } else return 0;
    })
  }
  sortirajAdresaOpadajuce(){
    this.sveFirme.sort((a,b) => {
      if(a.adresa < b.adresa){
        return 1;
      } else if(a.adresa > b.adresa) {
        return -1;
      } else return 0;
    })
  }

  
    filtrirajZakazivanjePoslednjih24h() {
      const datumPre24h = new Date();
      datumPre24h.setHours(datumPre24h.getHours() - 24); // Oduzimamo 24 sata

      this.datumi.forEach(zakazivanje => {
        const datumZakazivanja = new Date(zakazivanje);
        if (datumZakazivanja >= datumPre24h) {
          this.h24br = this.h24br + 1;
        }
      });
    }


    filtrirajZakazivanjePoslednjih7Dana() {
      const datumPre7Dana = new Date();
      datumPre7Dana.setDate(datumPre7Dana.getDate() - 7); // Oduzimamo 7 dana

      this.datumi.forEach(zakazivanje => {
        const datumZakazivanja = new Date(zakazivanje);
        if (datumZakazivanja >= datumPre7Dana) {
          this.sedambr = this.sedambr + 1;
        }
      });
    }

    filtrirajZakazivanjePoslednjihMesecDana() {
      const datumPreMesecDana = new Date();
      datumPreMesecDana.setMonth(datumPreMesecDana.getMonth() - 1); // Oduzimamo jedan mesec

      this.datumi.forEach(zakazivanje => {
        const datumZakazivanja = new Date(zakazivanje);
        if (datumZakazivanja >= datumPreMesecDana) {
          this.mesecbr = this.mesecbr + 1;
        }
      });
    }


}
