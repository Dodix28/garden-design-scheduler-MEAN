import { Component, OnInit,OnChanges, SimpleChanges,Input } from '@angular/core';
import { RasporedService } from '../services/raspored.service';
import { Raspored } from '../models/raspored';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnChanges {
  @Input() data: any[]= [];
  prelaziIvice: boolean = false;

  constructor(private rasporedService: RasporedService){}


    ngOnChanges(changes: SimpleChanges) {
      if (changes['data'] && this.data) {
        console.log('Podaci za canvas:', this.data); //primljeni podaci
        this.renderCanvas();
      }
    }



    renderCanvas() {
      const canvas = <HTMLCanvasElement>document.getElementById('bastaCanvas');
      const ctx = canvas?.getContext('2d');

      if (!ctx || !this.data) {
        console.error('Canvas element or context not avilable.');
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Očisti prethodni sadržaj
      //this.prelaziIvice = false;


      this.data.forEach((objekat: any) => {

        // Zelenila
        if(Array.isArray(objekat.zelenila)){
          objekat.zelenila.forEach((zelenilo: any) => {
              ctx.fillStyle = '#90EE90'; //svetlozelena
              ctx.fillRect(zelenilo.x, zelenilo.y, zelenilo.width, zelenilo.height);
              ctx.strokeRect(zelenilo.x, zelenilo.y, zelenilo.width, zelenilo.height);
          });
        } else {
          console.warn('Zelenilo nije definisano kao niz:', objekat.zelenila);
        }

        //bazeni
      if(Array.isArray(objekat.bazeni)){
        objekat.bazeni.forEach((bazen :any) => {
          ctx.fillStyle = '#ADD8E6'; //svetloplava
          ctx.fillRect(bazen.x, bazen.y, bazen.width, bazen.height);
          ctx.strokeRect(bazen.x, bazen.y, bazen.width, bazen.height);
        });
      } else {
        console.warn('bazeni nije definisano kao niz:', objekat.bazeni);
      }

      // Crtanje stolice
      if(Array.isArray(objekat.stolice)){
        objekat.stolice.forEach((stolica: any) => {
            ctx.fillStyle = 'grey';
            ctx.fillRect(stolica.x, stolica.y, stolica.width, stolica.height);
            ctx.strokeRect(stolica.x, stolica.y, stolica.width, stolica.height);
        });
       } else {
        console.warn('Stolice nije definisano kao niz:', objekat.stolice);
       }

       //crtanje stola
    if(Array.isArray(objekat.stolovi)){
      objekat.stolovi.forEach((sto: any) => {
          ctx.beginPath();
          ctx.arc(sto.x, sto.y, sto.radius, 0, 2 * Math.PI);
          ctx.fillStyle = '#D2B48C'; //svetlobran
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
    });
    } else {
      console.warn('Stolovi nije definisano kao niz:', objekat.stolovi);
    }

    //crtanje fontane
   if(Array.isArray(objekat.fontane)){
    objekat.fontane.forEach((fontana: any) => {
        ctx.beginPath();
        ctx.arc(fontana.x, fontana.y, fontana.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    });
   } else {
    console.warn('Fontane nije definisano kao niz:', objekat.fontane);
   }

  })

}

//------------------------------Da li elementi prelaze granice canvasa od width:800px i height: 600px---------------------------

   isWithinCanvas(x: number, y: number, width: number, height: number, canvasWidth: number, canvasHeight: number): boolean {
      return (
        x >= 0 &&
        y >= 0 &&
        x + width <= canvasWidth &&
        y + height <= canvasHeight
      );
    }
    checkAllElementsWithinCanvas(canvasWidth: number, canvasHeight: number): boolean {
      this.data.forEach((objekat: any) =>{
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




    /**STARO---------------------- */

  raspored: Raspored = new Raspored();

   // Provera da li raspored ima sve potrebne elemente pre nego što se nacrta
   isValidRaspored(raspored: any): boolean {
    return raspored &&
           Array.isArray(raspored.zelenila) &&
           Array.isArray(raspored.bazeni) &&
           Array.isArray(raspored.stolovi) &&
           Array.isArray(raspored.stolice) &&
           Array.isArray(raspored.fontane);
  }


  nacrtajRaspored(data: Raspored, ctx: CanvasRenderingContext2D | null): void {
    if (!ctx) return;

    // Crtanje zelenila
    data.zelenila.forEach(zelenilo => {
      ctx.fillStyle = 'green';
      ctx.fillRect(zelenilo.x, zelenilo.y, zelenilo.width, zelenilo.height);
      ctx.strokeRect(zelenilo.x, zelenilo.y, zelenilo.width, zelenilo.height);
    });

    // Crtanje bazena
    data.bazeni.forEach(bazen => {
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(bazen.x, bazen.y, bazen.width, bazen.height);
      ctx.strokeRect(bazen.x, bazen.y, bazen.width, bazen.height);
    });

      // Crtanje stolice
    data.stolice.forEach(stolica => {
      ctx.fillStyle = 'lightgrey';
      ctx.fillRect(stolica.x, stolica.y, stolica.width, stolica.height);
      ctx.strokeRect(stolica.x, stolica.y, stolica.width, stolica.height);
    });

    //crtanje stola
    data.stolovi.forEach(sto => {
      ctx.beginPath();
      ctx.arc(sto.x, sto.y, sto.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'brown';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
  });

     //crtanje fontane
     data.fontane.forEach(fontana => {
      ctx.beginPath();
      ctx.arc(fontana.x, fontana.y, fontana.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
  });


}


}
