import { Component, OnInit } from '@angular/core';
import { Firma } from '../models/firma';
import { FirmaService } from '../services/firma.service';
import {  FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Raspored } from '../models/raspored';
import { RasporedService } from '../services/raspored.service';

@Component({
  selector: 'app-vlasnik-firme',
  templateUrl: './vlasnik-firme.component.html',
  styleUrls: ['./vlasnik-firme.component.css']
})
export class VlasnikFirmeComponent implements OnInit{

  constructor(private firmaService: FirmaService, private formBuilder: FormBuilder,
    private rasporedService: RasporedService
  ) {
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
        opis: ['']
      });
  }



  ngOnInit(): void {
    this.firmaService.dohvatiSveFirme().subscribe((f: Firma[]) => {
      if(f != null){
        this.sveFirme = f;
        this.prikazaneFirme = f;
      }
    })
  }

  //podaci o korisnicima
  sveFirme: Firma[] = [];
  prikazaneFirme: Firma[] = [];

  //sort
  sortOption: string = "";
  porukaGreske: string = "";
  pretraga:string ="";

   //forma steps- zakazivanje
   firstFormGroup: FormGroup = this.formBuilder.group({});
   secondFormGroup: FormGroup = this.formBuilder.group({});

   datum: string = "";
   vreme: string = "";
   ukKvadratura: number = 0;
   tipBaste: string = "";
   //privatna
   bazeniPriv: number = 0;
   zeleniloPriv: number = 0;
   lezaljkeStoloviPriv: number = 0;
   //restoranska
   fontaneRest: number = 0;
   zeleniloRest: number =0;
   stoloviRest: number = 0;
   stoliceRest: number = 0;

   opis: string = "";

   //json raspored
   selectedFile: File | null = null;
   ucitanRaspored: Raspored = new Raspored();
   porukaGreskeRaspored: string = '';
   elements: any[] = [];
   uploadEnabled = false;




  /*----------------------------poseti firmu------------------------- */

  selectedFirm: number = 0;

  posetiFirmu(id: number){
    this.selectedFirm = id;
    localStorage.setItem('selectedFirmId',JSON.stringify(this.selectedFirm));
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

  /*------------------------------steps forma -------------------------- */
  onSubmit() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.tipBaste = this.firstFormGroup.value.tipBaste;
      if(this.tipBaste == "privatna"){
        this.bazeniPriv = this.secondFormGroup.value.bazeni;
        this.zeleniloPriv = this.secondFormGroup.value.zelenilo;
        this.lezaljkeStoloviPriv = this.secondFormGroup.value.lezaljkeStolovi;

      } else {
        //restoran
        this.fontaneRest = this.secondFormGroup.value.fontane;
        this.zeleniloRest = this.secondFormGroup.value.zeleniloRestoran;
        this.stoloviRest = this.secondFormGroup.value.stolovi;
        this.stoliceRest = this.secondFormGroup.value.stolice;
      }
      this.opis = this.secondFormGroup.value.opis;

      //provera da li firma radi tog dana(ili je na godisnjem)
      //da li ima slobodnih majstora
      //da li se kvadrature poklapaju

      //dodaj zakazivanje

      console.log('Подаци успешно послати!');
    } else {
      console.log('Форма није валидна');
    }
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
      const fileContent = e.target.result;
      try {
        const jsonData = JSON.parse(fileContent);
        if (Array.isArray(jsonData)) {
          this.elements = jsonData; // Ako je data niz objekata
          if (this.checkForOverlaps(this.elements)) {
            this.uploadEnabled = true;
            this.porukaGreske = '';
          } else {
            this.uploadEnabled = false;
            this.porukaGreske = 'Neki elementi se preklapaju. Molimo ispravite greške.';
          }
        } else {
          throw new Error("JSON struktura nije niz objekata.");
        }
      } catch (error) {
        this.uploadEnabled = false;
        this.porukaGreske = 'Greška u parsiranju JSON fajla.';
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
          localStorage.setItem('raspored',JSON.stringify(this.ucitanRaspored));
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
