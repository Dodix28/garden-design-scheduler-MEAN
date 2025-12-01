import * as express from "express";
import ZakazivanjeModel from "../models/zakazivanje"

export class ZakazivanjeController {

    dohvatiZakazivanjaVlasnik = (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;

        ZakazivanjeModel.find({kor_ime: kor_ime})
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
      }

    dohvatiNaCekanju = (req: express.Request, res: express.Response) => {
        let idF = req.body.idF;

        ZakazivanjeModel.find({idF: idF, status: "na cekanju"})
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    }

    odbijZakazanTermin = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idZ;
        let komentar = req.body.komentar;
        let dekorater = req.body.dekorater;

        ZakazivanjeModel.findOneAndUpdate({idZ: idZ},{komentar: komentar, dekorater: dekorater, status: "odbijeno"})
        .then((zakazivanje) => { res.json(zakazivanje) ; })
        .catch((err) => console.log(err));
    }

    prihvatiZakazanTermin  = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idZ;
        let dekorater = req.body.dekorater;

        ZakazivanjeModel.findOneAndUpdate({idZ: idZ},{dekorater: dekorater, status: "prihvaceno"})
        .then((zakazivanje) => { res.json(zakazivanje) ; })
        .catch((err) => console.log(err));
    }

    dohvatiZavrsenaZakazivanjaZaVlasnika = (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;

        ZakazivanjeModel.find({kor_ime: kor_ime, status: "zavrseno"})
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    } 

    dohvatiSvaZavrsenaZakazivanja = (req: express.Request, res: express.Response) => {
        ZakazivanjeModel.find({status: "zavrseno"})
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    }

    dohvatiZakazivanje = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idZ;

        ZakazivanjeModel.find({idZ: idZ})
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    }

    dodajZakazivanje = async (req: express.Request, res: express.Response) => {

        let datumZakazivanja = req.body.datumZakazivanja;
        let vreme = req.body.vreme;
        let kvadraturaBaste = req.body.kvadraturaBaste;
        let tipBaste = req.body.tipBaste;
        let kvZelenilo = req.body.kvZelenilo;
        let kvNamestaj = req.body.kvNamestaj;
        let kvFontana = req.body.kvFontana;
        let brStolova = req.body.brStolova;
        let brStolica = req.body.brStolica;
        let kvBazen = req.body.kvBazen;
        let idF = req.body.idF;
        let usluge = req.body.usluge;
        let idRaspored = req.body.idRaspored;
        let status = 'na cekanju';
        let kor_ime = req.body.kor_ime;
        let opis = req.body.opis;

        let datumIzrade = '';
        let datumZavrsetka = '';
        let dekorater = '';
        let komentar = '';



    
        let max = await ZakazivanjeModel.find({}).sort({ idZ: -1 }).limit(1);
       
        let x;
            if (max.length > 0) {
                x = max[0].idZ + 1;
            } else {
                x = 1;
            }
    
            let zakazivanje = new ZakazivanjeModel({
              idZ: x,
              datumZakazivanja:datumZakazivanja, 
              vreme:vreme,
              kvadraturaBaste: kvadraturaBaste,
              tipBaste: tipBaste,
              kvZelenilo: kvZelenilo,
              kvNamestaj: kvNamestaj,
              kvFontana: kvFontana,
              brStolova: brStolova,
              brStolica: brStolica,
              kvBazen: kvBazen,
              idF: idF,
              usluge: usluge,
              idRaspored: idRaspored,
              status: status,
              kor_ime: kor_ime,
              opis:opis,

              datumIzrade: datumIzrade,
              datumZavrsetka: datumZavrsetka,
              dekorater: dekorater,
              komentar: komentar,
            });
    
            await zakazivanje.save()
            .then((z) => {res.json(z);})
            .catch((err) => console.log(err));
      }

      postaviRaspored = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idZ;
        let idRaspored = req.body.idRaspored;

        ZakazivanjeModel.findOneAndUpdate({idZ: idZ},{idRaspored: idRaspored})
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    }

    dohvatiPrihvaceneZaRadnika = (req: express.Request, res: express.Response) => {
        let dekorater = req.body.dekorater;

        ZakazivanjeModel.find({dekorater: dekorater,status: "prihvaceno"})
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    }

    dohvatiPrihvaceneZaFirmu = (req: express.Request, res: express.Response) => {
        let idF = req.body.idF;

        ZakazivanjeModel.find({ idF: idF, status: { $in: ["prihvaceno", "zavrseno"] } })
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    }

    dohvatiZavrsenoInaCekanju = (req: express.Request, res: express.Response) => {

        ZakazivanjeModel.find({status: { $in: ["prihvaceno", "zavrseno","na cekanju"] } })
        .then((zakazivanja) => { res.json(zakazivanja) ; })
        .catch((err) => console.log(err));
    }

}