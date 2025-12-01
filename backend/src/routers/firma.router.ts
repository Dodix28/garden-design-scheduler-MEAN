import express from "express";
import { FirmaController } from "../controllers/firma.controller";

const firmaRouter = express.Router();

firmaRouter
  .route("/dohvatiSveFirme")
  .get((req, res) => new FirmaController().dohvatiSveFirme(req, res));

  firmaRouter
  .route("/dohvatiFirmu")
  .post((req, res) => new FirmaController().dohvatiFirmu(req, res));

  firmaRouter
  .route("/dohvatiFirmuPoNazivu")
  .post((req, res) => new FirmaController().dohvatiFirmuPoNazivu(req, res));

  firmaRouter
  .route("/dohvatiDekoratera")
  .post((req, res) => new FirmaController().findDekorater(req, res));

  firmaRouter
  .route("/addFirm")
  .post((req, res) => new FirmaController().addFirm(req, res));

  firmaRouter
  .route("/addDekorator")
  .post((req, res) => new FirmaController().dodajRadnika(req, res));

  firmaRouter
  .route("/addGodisnji")
  .post((req, res) => new FirmaController().addGodisnjiOdmor(req, res));


  export default firmaRouter;