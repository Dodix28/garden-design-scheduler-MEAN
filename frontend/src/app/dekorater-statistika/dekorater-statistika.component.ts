import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { OdrzavanjeService } from '../services/odrzavanje.service';
import { Korisnik } from '../models/user';
import { Zakazivanje } from '../models/zakazivanje';
import { Odrzavanje } from '../models/odrzavanje';
import { Firma } from '../models/firma';
import { FirmaService } from '../services/firma.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dekorater } from '../models/dekorater';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dekorater-statistika',
  templateUrl: './dekorater-statistika.component.html',
  styleUrls: ['./dekorater-statistika.component.css']
})
export class DekoraterStatistikaComponent implements OnInit{

  constructor(private zakazivanjeService: ZakazivanjeService, private odrzavanjeService: OdrzavanjeService,
    private firmaService: FirmaService
  ){}

  barChart: any;
  brojPoslovaPoMesecima = new Array(12).fill(0);

  ngOnInit(): void {
    let k = localStorage.getItem('ulogovan');
    if(k != null){
      this.ulogovan = JSON.parse(k);
    }

    this.zakazivanjeService.dohvatiPrihvaceneZaRadnika(this.ulogovan.kor_ime).subscribe((z: Zakazivanje[]) => {
      this.odrzavanjeService.dohvatiPrihvaceneZaRadnika(this.ulogovan.kor_ime).subscribe((o: Odrzavanje[]) => {
        if(z!=null){
          this.zakazivanjaRadnik = z;
          console.log('zakazani',z)
        }
        if(o!= null){
          this.odrzavanjaRadnik = o;
        }
        this.createBarChart(this.combineAndCountByMonth(this.zakazivanjaRadnik,this.odrzavanjaRadnik));
      })
    })

    //CHART 2

    let f = localStorage.getItem('selectedFirmId');
    if(f != null){
      this.selectedFirmId = JSON.parse(f);
    }


    this.firmaService.dohvatiFirmu(this.selectedFirmId).subscribe((f: Firma) => {
      const firma = Array.isArray(f) ? f[0] : f;
      if (firma != null) {
        // Izvlačimo imena dekoratera
        firma.dekorateri.forEach((dekorater: any) => {
          this.dekoraterNames.push(dekorater.kor_ime);
        });

        // Kreiramo dekoratere sa početnim brojem poslova 0
        this.dekoraterNames.forEach((d) => {
          const dekorater = new Dekorater();
          dekorater.kor_ime = d;
          this.dekorateri.push(dekorater);
        });

        // Kreiramo niz observables za sve zahteve
        const observables = this.dekoraterNames.map(d =>
          forkJoin([
            this.zakazivanjeService.dohvatiPrihvaceneZaRadnika(d),
            this.odrzavanjeService.dohvatiPrihvaceneZaRadnika(d)
          ]).pipe(
            map(([zakazivanja, odrzavanja]) => ({ zakazivanja, odrzavanja, d }))
          )
        );

        // Sačekaj sve zahteve da završe
        forkJoin(observables).subscribe(results => {
          results.forEach(({ zakazivanja, odrzavanja, d }) => {
            // Obrada zakazivanja
            if (zakazivanja != null) {
              zakazivanja.forEach((zak: Zakazivanje) => {
                this.dekorateri.forEach(dekor => {
                  if (dekor.kor_ime === d) {
                    dekor.brPoslova += 1;
                  }
                });
              });
            }

            // Obrada odrzavanja
            if (odrzavanja != null) {
              odrzavanja.forEach((odr: Odrzavanje) => {
                this.dekorateri.forEach(dekor => {
                  if (dekor.kor_ime === d) {
                    dekor.brPoslova += 1;
                  }
                });
              });
            }
          });

          // Popunimo broj poslova za prikaz
          this.dekorateri.forEach(dec => {
            this.brojPoslova.push(dec.brPoslova);
          });

          // Logujemo rezultate
          console.log('svi dekorateri u firmi', this.dekorateri);
          console.log('broj poslova u firmi', this.brojPoslova);
          console.log('svi dekorateri imena u firmi', this.dekoraterNames);

          // Ovdje možete pozvati funkciju za kreiranje grafikona
          this.createPieChart(this.dekorateri.map(d => d.kor_ime), this.brojPoslova);
        });
      }
    });





      forkJoin([
        this.zakazivanjeService.dohvatiPrihvaceneZaFirmu(this.selectedFirmId),
        this.odrzavanjeService.dohvatiPrihvaceneZaFirmu(this.selectedFirmId)
      ]).subscribe(([zakazivanja, odrzavanja]) => {
        // Očisti prethodne datume i inicijalizuj mesece
        this.datumi = [];
        this.weekCount = new Array(12).fill(0);

        // Popuni niz sa datumima
        const allDates = [
          ...odrzavanja.map(o => o.datumZavrsetka),
          ...zakazivanja.map(z => z.datumZakazivanja)
        ];

        // Obradi sve datume i ažuriraj mesece
        this.weekCount = allDates.reduce((acc, date) => {
          return this.incrementWeekDayCount(date, acc);
        }, this.weekCount);

        // Ispiši rezultate
        console.log('datumi za chart3', allDates);
        console.log('Meseci Count:', this.weekCount);

        this.createHistogram(this.weekCount);
      });

    console.log('CHART3INFO',this.weekCount);
  }

  //prvi chart
  ulogovan: Korisnik = new Korisnik();
  zakazivanjaRadnik: Zakazivanje[]= [];
  odrzavanjaRadnik: Odrzavanje[] = [];

  //drugi chart
  selectedFirm: Firma = new Firma();
  selectedFirmId: number = 0;
  dekoraterNames: string[] = [];
  brojPoslova: number[] = [];
  dekorateri: Dekorater[] = [];

  //treci chart
  posloviOdrzavanja: Odrzavanje[] = []; //prihvaceno
  posloviZakazivanje: Zakazivanje [] = [];  //prihvaceno,zavrseno
  datumi: string[] = [];
  monthsCount: number[] = new Array(12).fill(0);
  weekCount: number[] = new Array(7).fill(0);


  /*---------------------------------------------CHART 1---------------------------------------- */
  //poslovi po mesecima
  posloviPoMesecima(jobs: any[]): number[] {

    const brojPoslovaPoMesecima = new Array(12).fill(0);
    jobs.forEach((job) => {
      const datum = job.datumZakazivanja;

      if (datum) {
        // Izdvajamo mesec iz datuma (meseci su u formatu 01-12, pa oduzimamo 1 da dobijemo indeks 0-11)
        const mesec = parseInt(datum.split('-')[1], 10) - 1;
        if (mesec >= 0 && mesec < 12) {
          brojPoslovaPoMesecima[mesec]++;
        }
      }
    });
    return brojPoslovaPoMesecima; // Vraćamo niz sa brojem poslova po mesecima
  }
  //broj poslova po mesecima i za odrzavanje i zakazivanje
  combineAndCountByMonth(
    zakazivanjaRadnik: Zakazivanje[],
    odrzavanjaRadnik: Odrzavanje[]
  ): number[] {
    const brojPoslovaPoMesecima = new Array(12).fill(0);

    // Funkcija za izdvajanje meseca iz datuma i ažuriranje brojača
    const countByMonth = (datum: string) => {
      const mesec = parseInt(datum.split('-')[1], 10) - 1;
      if (mesec >= 0 && mesec < 12) {
        brojPoslovaPoMesecima[mesec]++;
      }
    };

    // Prolazimo kroz svaki element zakazivanja i brojimo poslove po mesecima
    zakazivanjaRadnik.forEach((zakazivanje) => {
      if (zakazivanje.datumZakazivanja) {
        countByMonth(zakazivanje.datumZakazivanja);
      }
    });

    // Prolazimo kroz svaki element odrzavanja i brojimo poslove po mesecima
    odrzavanjaRadnik.forEach((odrzavanje) => {
      if (odrzavanje.datumZavrsetka) {
        countByMonth(odrzavanje.datumZavrsetka);
      }
    });

    return brojPoslovaPoMesecima; // Vraćamo niz sa brojem poslova po mesecima
  }

  createBarChart(brojPoslova: number[]) {
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
        datasets: [{
          label: 'Broj poslova po mesecima',
          data: brojPoslova, // podaci
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  /*-------------------------------------------CHART 2 - PITA--------------------------------- */


  createPieChart(dekorateri: string[], brojPoslova: number[]) {
    console.log('dekorateri',dekorateri);
    console.log('brojposlova',brojPoslova);
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: dekorateri, // imena dekoratera
        datasets: [{
          data: brojPoslova, // broj poslova
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderColor: '#fff',
          borderWidth: 1
        }]
      }

    });
  }


  /**--------------------------CHART 3 HISTOGRAM ----------------------------- */

  createHistogram(data: number[]) {
    new Chart('histogram', {
      type: 'bar',
      data: {
        labels: ['Pon', 'Uto', 'Sre', 'Cet', 'Pet', 'Sub', 'Ned'],
        datasets: [{
          label: 'Prosečan mesečni broj poslova',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }



incrementMonthCount(dateStr: string, monthsCount: number[]): number[] {
  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) {
    console.error("Nevalidan datum:", dateStr);
    return monthsCount;
  }

  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setMonth(currentDate.getMonth() - 24);

  const updatedMonthsCount = [...monthsCount];

  if (inputDate >= pastDate && inputDate <= currentDate) {
    const monthIndex = inputDate.getMonth();
    updatedMonthsCount[monthIndex]++;
  } else {
    console.log("Datum nije u poslednjih 24 meseca:", dateStr);
  }

  return updatedMonthsCount;
}


incrementWeekDayCount(dateStr: string, daysCount: number[]): number[] {
  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) {
    console.error("Nevalidan datum:", dateStr);
    return daysCount;
  }

  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setMonth(currentDate.getMonth() - 24);

  const updatedDaysCount = [...daysCount];


  if (inputDate >= pastDate && inputDate <= currentDate) {
    const dayOfWeekIndex = inputDate.getDay();
    updatedDaysCount[dayOfWeekIndex]++;
  } else {
    console.log("Datum nije u poslednjih 24 meseca:", dateStr);
  }

  return updatedDaysCount;
}


}


