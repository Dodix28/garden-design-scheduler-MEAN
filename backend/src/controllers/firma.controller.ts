import * as express from "express";
import FirmaModel from "../models/firma"

export class FirmaController {

    dohvatiSveFirme = (req: express.Request, res: express.Response) => {
      FirmaModel.find({})
        .then((firme) => { res.json(firme) ; })
        .catch((err) => console.log(err));
      }

    dohvatiFirmu  = (req: express.Request, res: express.Response) => {
      let idF = req.body.idF;

      FirmaModel.findOne({idF: idF})
      .then((firma) => { res.json(firma) ; })
      .catch((err) => console.log(err));
      }

      dohvatiFirmuPoNazivu  = (req: express.Request, res: express.Response) => {
        let naziv = req.body.naziv;
  
        FirmaModel.findOne({naziv: naziv})
        .then((firma) => { res.json(firma) ; })
        .catch((err) => console.log(err));
        }

    findDekorater = (req: express.Request, res: express.Response) => {
      let kor_ime = req.body.kor_ime;
      console.log('kor ime',kor_ime);
      FirmaModel.findOne({"dekorateri.kor_ime" : kor_ime})
      .then((firma) => { console.log("firma za dekoratera",firma); res.json(firma) ; })
      .catch((err) => console.log(err));
    }

    addFirm = async (req: express.Request, res: express.Response) => {

      let naziv = req.body.naziv;
      let adresa = req.body.adresa;
      let kontakt = req.body.kontakt;
      let usluge = req.body.usluge;
      let lokacija = req.body.lokacija;
  
      let max = await FirmaModel.find({}).sort({ idF: -1 }).limit(1);
     
      let x;
          if (max.length > 0) {
              x = max[0].idF + 1;
          } else {
              x = 1;
          }
  
          let firma = new FirmaModel({
            idF: x,
            naziv:naziv, 
            adresa:adresa,
            kontakt: kontakt,
            usluge: usluge,
            dekorateri: [],
            lokacija: lokacija,
            godisnji_odmor: {pocetak: '', kraj: ''}
          });
  
          await firma.save()
          .then((r) => {res.json(r);})
          .catch((err) => console.log(err));
    }

    dodajRadnika = async (req: express.Request, res: express.Response) => {
      let ime = req.body.ime;
      let prezime = req.body.prezime;
      let kor_ime = req.body.kor_ime;
      let idF = req.body.idF;

      const noviDekorater = {
        kor_ime: kor_ime,
        ime:ime,
        prezime: prezime
      }
      try{
            const firma = await FirmaModel.findOne({idF: idF})
            if (!firma) {
              return res.status(404).json({ message: 'Firma nije pronađena' });
            }

            firma.dekorateri.push(noviDekorater);
            await firma.save();
            return res.status(200).json({ message: 'Dekorater uspešno dodat', firma });
      } catch (error) {
        return res.status(500).json({ message: 'Greška na serveru', error });
      }


    }

    addGodisnjiOdmor = async (req: express.Request, res: express.Response) => {
      let pocetak = req.body.pocetak;
      let kraj = req.body.kraj;
      let idF = req.body.idF;

      const godisnji = {
        pocetak: pocetak,
        kraj:kraj
      }

      try{
        const firma = await FirmaModel.findOne({idF: idF})
        if (!firma) {
          return res.status(404).json({ message: 'Firma nije pronađena' });
        }

        firma.godisnji_odmor = godisnji;

        await firma.save();
        return res.status(200).json({ message: 'Godisnji uspešno dodat', firma });
  } catch (error) {
    return res.status(500).json({ message: 'Greška na serveru', error });
  }

    }

   

}