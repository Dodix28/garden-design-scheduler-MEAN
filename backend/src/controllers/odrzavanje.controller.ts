import * as express from "express";
import OdrzavanjeModel from "../models/odrzavanje"

export class OdrzavanjeController {

    dohvatiNaCekanju = (req: express.Request, res: express.Response) => {
      let idF = req.body.idF;

        OdrzavanjeModel.find({status: "na cekanju"})
        .then((odrzavanja) => { res.json(odrzavanja) ; })
        .catch((err) => console.log(err));
      }

      dohvatiOdrzavanjeZahtev = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idF;
  
          OdrzavanjeModel.find({idZ: idZ})
          .then((odrzavanja) => { res.json(odrzavanja) ; })
          .catch((err) => console.log(err));
        }

      dohvatiNaCekanjuZaZahtev = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idF;
  
          OdrzavanjeModel.find({idZ: idZ,status: "na cekanju"})
          .then((odrzavanja) => { res.json(odrzavanja) ; })
          .catch((err) => console.log(err));
        }

      changeStatus = (req: express.Request, res: express.Response) =>{
        let status = req.body.status;
        let idO = req.body.idO;

        OdrzavanjeModel.findOneAndUpdate({idO: idO},{status: status})
        .then((odrzavanja) => { res.json(odrzavanja) ; })
        .catch((err) => console.log(err));
      }

      postaviDatumVreme = (req: express.Request, res: express.Response) => {
        let datumZavrsetka = req.body.datumZavrsetka;
        let vremeZavrsetka = req.body.vremeZavrsetka;
        let idO = req.body.idO;

        OdrzavanjeModel.findOneAndUpdate({idO: idO},{vremeZavrsetka: vremeZavrsetka, datumZavrsetka: datumZavrsetka})
        .then((odrzavanje) => { res.json(odrzavanje) ; })
        .catch((err) => console.log(err));
      }

     dohvatiPrihvacenoiNaCekanju = (req: express.Request, res: express.Response) => {
      let idZ = req.body.idZ;

      OdrzavanjeModel.find({idZ: idZ,status: {$in: ["prihvaceno","na cekanju"]}})
      .then((odrzavanje) => { res.json(odrzavanje) ; })
      .catch((err) => console.log(err));
     }

     addOdrzavanje = async (req: express.Request, res: express.Response) => {
      let idZ = req.body.idZ;
      let idF = req.body.idF;

     let status = "na cekanju";
     let datumZavrsetka = "";
     let vremeZavrsetka = "";
     let dekorater = "";
  
      let max = await OdrzavanjeModel.find({}).sort({ idO: -1 }).limit(1);
     
      let x;
          if (max.length > 0) {
              x = max[0].idO + 1;
          } else {
              x = 1;
          }
  
          let odrzavanje = new OdrzavanjeModel({
            idO: x,
            status:status, 
            datumZavrsetka:datumZavrsetka,
            vremeZavrsetka: vremeZavrsetka,
            dekorater: dekorater,
            idZ: idZ,
            idF: idF
          });
  
          await odrzavanje.save()
          .then((o) => {res.json(o);})
          .catch((err) => console.log(err));
    }

    dohvatiPrihvaceneZaRadnika = (req: express.Request, res: express.Response) => {
      let dekorater = req.body.dekorater;

      OdrzavanjeModel.find({dekorater: dekorater,status: "prihvaceno"})
      .then((zakazivanja) => { res.json(zakazivanja) ; })
      .catch((err) => console.log(err));
  }

  dohvatiPrihvaceneZaFirmu  = (req: express.Request, res: express.Response) => {
    let idF = req.body.idF;

    OdrzavanjeModel.find({idF: idF,status: "prihvaceno"})
    .then((zakazivanja) => { res.json(zakazivanja) ; })
    .catch((err) => console.log(err));
}

    
}
