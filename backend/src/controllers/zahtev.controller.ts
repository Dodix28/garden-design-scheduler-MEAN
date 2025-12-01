import * as express from "express";
import ZahtevModel from "../models/zahtev"
import multer from "multer";
import path from "path";

//konfiguracija za skladistenje fajlova
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Koristi originalno ime datoteke
    }
  });
  
  //multer konfiguracija, obrada primljenih fajlova
  const  upload = multer({storage: storage});
  
  export const uploadMiddleware = upload.single('image');

export class ZahtevController {


    addRequest = async (req: express.Request, res: express.Response) => {

        let ime = req.body.ime;
        let prezime = req.body.prezime;
        let kor_ime = req.body.kor_ime;
        let lozinka = req.body.lozinka;
        let mejl = req.body.mejl;
        let pol = req.body.pol;
        let adresa = req.body.adresa;
        let kontakt = req.body.kontakt;
        let brKartice = req.body.brKartice;
    
        let max = await ZahtevModel.find({}).sort({ idZ: -1 }).limit(1);
       
        let x;
            if (max.length > 0) {
                x = max[0].idZ + 1;
            } else {
                x = 1;
            }
    
        let newRequest = new ZahtevModel({
            ime: ime, prezime: prezime, kor_ime: kor_ime, lozinka: lozinka , 
            mejl: mejl, tip: "vlasnik", pol: pol, adresa: adresa, kontakt: kontakt, brKartice: brKartice,
            profilna: "default.png", status: "na cekanju" ,idZ:x
        })
    
        await newRequest.save()
        .then(user => {res.json(user)})
        .catch((err) => console.log(err));
      };

      uploadImage = (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;
        let fileName: string = req.file ? req.file.filename : 'default.png';
    
    
        let updateFields: any = {};
    
        if (fileName != '') {
          updateFields.profilna = fileName;
        }
          console.log(kor_ime);
          console.log(fileName);
          ZahtevModel.findOneAndUpdate({kor_ime: kor_ime}, updateFields,{new: true})
            .then(updatedReq => {console.log(updatedReq); res.json(updatedReq); })
            .catch((err) => console.error('Greška prilikom findOneAndUpdate:', err));
        };

    getUsername = (req: express.Request, res: express.Response) => {
        let kor_ime = req.body.kor_ime;
    
        ZahtevModel.findOne({ kor_ime: kor_ime })
          .then((zahtev) => {
            res.json(zahtev);
          })
          .catch((err) => console.log(err));
      };

      getMail = (req: express.Request, res: express.Response) => {
        let mejl = req.body.mejl;
    
        ZahtevModel.findOne({ mejl: mejl })
          .then((zahtev) => {
            res.json(zahtev);
          })
          .catch((err) => console.log(err));
      };

      dohvatiNaCekanju = (req: express.Request, res: express.Response) => {
        
        ZahtevModel.find({status: "na cekanju"})
        .then((zahtev) => {
          res.json(zahtev);
        })
        .catch((err) => console.log(err));
      }

      acceptRequest = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idZ;
  
        ZahtevModel.findOneAndUpdate({idZ:idZ},{status: "prihvaceno"})
        .then((zahtevi) => { res.json(zahtevi) ; })
        .catch((err) => console.log(err));
      }
  
      declineRequest = (req: express.Request, res: express.Response) => {
        let idZ = req.body.idZ;
  
        ZahtevModel.findOneAndUpdate({idZ:idZ},{status: "odbijeno"})
        .then((zahtevi) => { res.json(zahtevi) ; })
        .catch((err) => console.log(err));
      }
}