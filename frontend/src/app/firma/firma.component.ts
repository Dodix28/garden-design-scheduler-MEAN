import { Component, OnInit, ViewChild } from '@angular/core';
import { Korisnik } from '../models/user';
import { Firma } from '../models/firma';
import { UserService } from '../services/user.service';
import { FirmaService } from '../services/firma.service';
import { Router } from '@angular/router';
import { FormBuilder ,FormGroup, Validators} from '@angular/forms';
import { RasporedService } from '../services/raspored.service';
import { Raspored } from '../models/raspored';
import { Usluga } from '../models/usluga';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { Zakazivanje } from '../models/zakazivanje';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css']
})
export class FirmaComponent implements OnInit{
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private userService: UserService,private firmaService: FirmaService,private router: Router,
    private formBuilder: FormBuilder,
    private rasporedService: RasporedService,private zakazivanjeService: ZakazivanjeService
  ){
    // Inicijalizacija prvog FormGroup
    this.firstFormGroup = this.formBuilder.group({
      datum: ['', Validators.required],
      vreme: ['', Validators.required],
      kvadratura: ['', [Validators.required, Validators.min(10)]],
      tipBaste: ['', Validators.required]
    });

    // Inicijalizacija drugog FormGroup
    this.secondFormGroup = this.formBuilder.group({
      bazeni: [''],
      zelenilo: [''],
      lezaljkeStolovi: [''],
      fontane: [''],
      zeleniloRestoran: [''],
      stolovi: [''],
      stolice: [''],
      opis: [''],
      usluge: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
   let u = localStorage.getItem('ulogovan');
   if(u != null){
    this.ulogovan = JSON.parse(u);
   }
   let id = localStorage.getItem('selectedFirmId');
   if(id != null) {
    this.selectedFirmId = JSON.parse(id);
    this.firmaService.dohvatiFirmu(this.selectedFirmId).subscribe((f: Firma) => {
      if(f != null){
        this.selectedFirm = f;
        this.selectedFirm.usluge.forEach((u: Usluga) => {
          u.selected = false;
        })
      } else {
        alert('greska pri dohvatanju firme preko id.');
      }
    })
   }
  }

//forma steps- zakazivanje
 firstFormGroup: FormGroup = this.formBuilder.group({});
 secondFormGroup: FormGroup = this.formBuilder.group({});
 datum: string = "";
   vreme: string = "";
   ukKvadratura: number = 0;
   tipBaste: string = "";
   usluge: Array<Usluga> = [];
   //privatna
   bazeniPriv: number = 0;
   zeleniloPriv: number = 0;
   lezaljkeStoloviPriv: number = 0;
   //restoranska
   fontaneRest: number = 0;
   zeleniloRest: number =0;
   stoloviRest: number = 0;
   stoliceRest: number = 0;
   //objedinjeno
   zelenilo: number = 0;
   kvNamestaj: number = 0;
   kvFontana: number = 0;
   brStolovi: number = 0;
   brStolice: number = 0;
   kvBazen: number = 0;

   opis: string = "";

   //json raspored
   selectedFile: File | null = null;
   ucitanRaspored: Raspored = new Raspored();
   porukaGreskeRaspored: string = '';
   elements: any[] = [];
   uploadEnabled = false;
   porukaGreske: string = '';

  canvasData: any;
  prikaziCanvas: boolean = false;


  ulogovan: Korisnik = new Korisnik();
  selectedFirm: Firma = new Firma();
  selectedFirmId: number = 0;


  /*------------------------------steps forma -------------------------- */
  onSubmit() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.tipBaste = this.firstFormGroup.value.tipBaste;
      this.datum = this.firstFormGroup.value.datum;
      this.vreme = this.firstFormGroup.value.vreme;
      this.ukKvadratura = this.firstFormGroup.value.kvadratura;
      this.opis = this.secondFormGroup.value.opis;

      if(this.tipBaste == "privatna"){
        this.bazeniPriv = this.secondFormGroup.value.bazeni;
        this.zeleniloPriv = this.secondFormGroup.value.zelenilo;
        this.lezaljkeStoloviPriv = this.secondFormGroup.value.lezaljkeStolovi;
        this.selectedFirm.usluge.forEach((u: Usluga) =>{
          if(u.selected){
            this.usluge.push(u);
          }
        })

      } else {
        //restoran
        this.fontaneRest = this.secondFormGroup.value.fontane;
        this.zeleniloRest = this.secondFormGroup.value.zeleniloRestoran;
        this.stoloviRest = this.secondFormGroup.value.stolovi;
        this.stoliceRest = this.secondFormGroup.value.stolice;
        this.selectedFirm.usluge.forEach((u: Usluga) =>{
          if(u.selected){
            this.usluge.push(u);
          }
        })
      }




      //provera da li firma radi tog dana(ili je na godisnjem)
      //da li ima slobodnih majstora
      //da li se kvadrature poklapaju

      //dodaj zakazivanje
      if(this.tipBaste == "privatna"){
        this.zelenilo = this.zeleniloPriv;
        this.kvNamestaj = this.lezaljkeStoloviPriv;
        this.kvFontana = 0;
        this.kvBazen = this.bazeniPriv;
        this.brStolice = 0;
        this.brStolovi = 0;

      } else {
        this.zelenilo = this.zeleniloRest;
        this.kvNamestaj = 0;
        this.kvFontana = this.fontaneRest;
        this.kvBazen = 0;
        this.brStolice = this.stoloviRest;
        this.brStolice = this.stoliceRest;
      }

        this.zakazivanjeService.dodajZakazivanje(this.ulogovan.kor_ime,this.formatDate(this.datum),this.ukKvadratura,this.vreme,this.tipBaste,this.zelenilo,this.kvNamestaj,
          this.kvFontana,this.brStolovi,this.brStolice,this.kvBazen,this.selectedFirmId,this.usluge,0,this.opis
        ).subscribe((z: Zakazivanje)=>{
          if(z != null){

            if (this.selectedFile && this.uploadEnabled) {
              this.rasporedService.uploadRaspored(this.selectedFile).subscribe((r: Raspored) => {
                if(r != null){
                  this.ucitanRaspored = r;
                  alert("uspesno ucitan fajl");
                  this.prikaziCanvas = false;
                  this.uploadEnabled = false;
                  this.stepper.reset();
                  this.zakazivanjeService.dodajRaspored(z.idZ,r.idRaspored).subscribe((zak: Zakazivanje) => {
                    if(zak == null){
                      alert('greska pri postavljanju idRasporeda!')
                    } else {
                      this.stepper.reset();
                    }
                  })

                } else {
                  alert("Neuspesno ucitan fajl");
                }
              })
            }

            this.stepper.reset();
            this.selectedFirm.usluge.forEach((u: Usluga) => {
              u.selected = false;
            })
            alert('Uspesno ste poslali zahtev');
          } else {
            alert('GRESKA pri slanju zahteva')
          }
        })


      console.log('Подаци успешно послати!');
    } else {
      console.log('Форма није валидна');
    }
  }

  toggleUslugaSelection(usluga: Usluga) {
    usluga.selected = !usluga.selected;
  }
  resetStepper() {
    this.stepper.reset();
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Dobijamo godinu, mesec i dan
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meseci su 0-indexed, dodajemo 1
    const day = date.getDate().toString().padStart(2, '0');
    // Vraćamo format YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }

  /*-------------------------------ucitavanje JSON za raspored baste-------- */
  isWithinCanvas(x: number, y: number, width: number, height: number, canvasWidth: number, canvasHeight: number): boolean {
    return (
      x >= 0 &&
      y >= 0 &&
      x + width <= canvasWidth &&
      y + height <= canvasHeight
    );
  }
  checkAllElementsWithinCanvas(canvasWidth: number, canvasHeight: number): boolean {
    this.elements.forEach((objekat: any) =>{
      //zelenila
      if(Array.isArray(objekat.zelenila)){
        if (objekat.zelenila.some((zelenilo: any) =>
          !this.isWithinCanvas(zelenilo.x, zelenilo.y, zelenilo.width, zelenilo.height, canvasWidth, canvasHeight)
        )) {
          return false; // Ako bilo koji element prelazi ivice, vrati false
        }
      }
      //bazeni
      if(Array.isArray(objekat.bazeni)){
        if (objekat.bazeni.some((bazen: any) =>
          !this.isWithinCanvas(bazen.x, bazen.y, bazen.width, bazen.height, canvasWidth, canvasHeight)
        )) {
          return false; // Ako bilo koji element prelazi ivice, vrati false
        }
       }
       //stolice
      if(Array.isArray(objekat.stolice)){
        if (objekat.stolice.some((stolica: any) =>
          !this.isWithinCanvas(stolica.x, stolica.y, stolica.width, stolica.height, canvasWidth, canvasHeight)
        )) {
          return false; // Ako bilo koji element prelazi ivice, vrati false
        }
       }
       //stolovi
       if(Array.isArray(objekat.stolovi)){
        if (objekat.stolovi.some((sto: any) =>
          !this.isWithinCanvas(sto.x, sto.y, sto.radius * 2, sto.radius * 2, canvasWidth, canvasHeight)
        )) {
          return false; // Ako bilo koji element prelazi ivice, vrati false
        }
       }
        //fontane
        if(Array.isArray(objekat.fontane)){
          if (objekat.fontane.some((fontana: any) =>
            !this.isWithinCanvas(fontana.x, fontana.y, fontana.radius * 2, fontana.radius * 2, canvasWidth, canvasHeight)
          )) {
            return false; // Ako bilo koji element prelazi ivice, vrati false
          }
         }
         return true;
    })
    return true;
  }

  checkForOverlaps(data: any[]): boolean {
    // Pretpostavljamo da data predstavlja niz objekata
    return data.every((element: any) => {
      const allElements = [
        ...element.zelenila.map((item: any) => ({ type: 'rect', ...item })),
        ...element.bazeni.map((item: any) => ({ type: 'rect', ...item })),
        ...element.stolovi.map((item: any) => ({ type: 'circle', ...item })),
        ...element.stolice.map((item: any) => ({ type: 'rect', ...item })),
        ...element.fontane.map((item: any) => ({ type: 'circle', ...item })) // Ako fontane imaju radius
      ];

      for (let i = 0; i < allElements.length; i++) {
        for (let j = i + 1; j < allElements.length; j++) {
          const el1 = allElements[i];
          const el2 = allElements[j];

          if (el1.type === 'rect' && el2.type === 'rect') {
            if (this.isOverlapping(el1, el2)) {
              return false;
            }
          } else if (el1.type === 'circle' && el2.type === 'circle') {
            if (this.isOverlappingCircle(el1, el2)) {
              return false;
            }
          } else if ((el1.type === 'rect' && el2.type === 'circle') ||
                     (el1.type === 'circle' && el2.type === 'rect')) {
            if (this.isOverlappingRectCircle(el1, el2)) {
              return false;
            }
          }
        }
      }
      return true;
    });
  }


//da li se dva pravougaonika preklapaju
isOverlapping(a: any, b: any): boolean {
  // U zavisnosti od vrste objekta, koristi različite metode za proveru preklapanja.
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

// Proverava da li se krugovi preklapaju
isOverlappingCircle(a: any, b: any): boolean {
const dx = a.x - b.x;
const dy = a.y - b.y;
const distance = Math.sqrt(dx * dx + dy * dy);
return distance < (a.radius + b.radius);
}

// Proverava da li se pravougaonici i krugovi preklapaju
isOverlappingRectCircle(rect: any, circle: any): boolean {
const distX = Math.abs(circle.x - rect.x - rect.width / 2);
const distY = Math.abs(circle.y - rect.y - rect.height / 2);

if (distX > (rect.width / 2 + circle.radius) || distY > (rect.height / 2 + circle.radius)) {
  return false;
}

if (distX <= (rect.width / 2) || distY <= (rect.height / 2)) {
  return true;
}

const dx = distX - rect.width / 2;
const dy = distY - rect.height / 2;
return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

onFileSelected(event: any) {
this.selectedFile = event.target.files[0];

if (this.selectedFile) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    try {
      const json = JSON.parse(e.target.result);
      console.log('Učitani podaci:', json);
      if(Array.isArray(json)){
        this.elements =json;
        if(this.checkForOverlaps(this.elements)){
          this.uploadEnabled = true;
          this.porukaGreske = '';
          this.canvasData = json; // Postavi podatke za canvas
            this.prikaziCanvas = true;
          /*if(this.checkAllElementsWithinCanvas(800,600)){
            this.canvasData = json; // Postavi podatke za canvas
            this.prikaziCanvas = true;
          } else {
          this.uploadEnabled = false;
          this.porukaGreske = 'Neki elementi se van granica canvasa. Molimo ispravite greške.';
          }*/

        } else {
          this.uploadEnabled = false;
          this.porukaGreske = 'Neki elementi se preklapaju. Molimo ispravite greške.';
        }
      }


      //this.canvasData = json;
     //this.prikaziCanvas = true;
    } catch (error) {
      console.error('Nevalidan JSON fajl', error);
    }
  };
  reader.readAsText(this.selectedFile);
}



}

onUpload() {
  if (this.selectedFile && this.uploadEnabled) {
    this.rasporedService.uploadRaspored(this.selectedFile).subscribe((r: Raspored) => {
      if(r != null){
        this.ucitanRaspored = r;
        alert("uspesno ucitan fajl");
        this.prikaziCanvas = false;
        this.uploadEnabled = false;
      //provera da li se objekti preklapaju, ako da ispisuje se poruka fajl se brise i porukom se kaze ucitajte novi
      } else {
        alert("Neuspesno ucitan fajl");
      }
    }
    );
  }  else {
    alert("Ne možete upload-ovati fajl dok ne ispravite greške.");
  }
}


}
