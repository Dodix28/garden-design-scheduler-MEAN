import express from "express";
import { OdrzavanjeController } from "../controllers/odrzavanje.controller";


const odrzavanjeRouter = express.Router();

odrzavanjeRouter
  .route("/dohvatiNaCekanju")
  .post((req,res) => new OdrzavanjeController().dohvatiNaCekanju(req,res));

  odrzavanjeRouter
  .route("/changeStatus")
  .post((req,res) => new OdrzavanjeController().changeStatus(req,res));

  odrzavanjeRouter
  .route("/postaviDatumVreme")
  .post((req,res) => new OdrzavanjeController().postaviDatumVreme(req,res));

  
  odrzavanjeRouter
  .route("/getPrihvacenoInaCekanju")
  .post((req,res) => new OdrzavanjeController().dohvatiPrihvacenoiNaCekanju(req,res));

  odrzavanjeRouter
  .route("/addOdrzavanje")
  .post((req,res) => new OdrzavanjeController().addOdrzavanje(req,res));

  odrzavanjeRouter
  .route("/dohvatiNaCekanjuZahtev")
  .post((req,res) => new OdrzavanjeController().dohvatiNaCekanjuZaZahtev(req,res));

  odrzavanjeRouter
  .route("/dohvatiOdrzavanjeZahtev")
  .post((req,res) => new OdrzavanjeController().dohvatiOdrzavanjeZahtev(req,res));

  odrzavanjeRouter
  .route("/dohvatiPrihvaceneZaRadnika")
  .post((req,res) => new OdrzavanjeController().dohvatiPrihvaceneZaRadnika(req,res));

  odrzavanjeRouter
  .route("/dohvatiPrihvaceneZaFirmu")
  .post((req,res) => new OdrzavanjeController().dohvatiPrihvaceneZaFirmu(req,res));

  export default odrzavanjeRouter;