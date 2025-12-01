import express from "express";
import { ZakazivanjeController } from "../controllers/zakazivanje.controller";

const zakazivanjeRouter = express.Router();

zakazivanjeRouter
  .route("/dohvatiZakazivanjaVlasnik")
  .post((req, res) => new ZakazivanjeController().dohvatiZakazivanjaVlasnik(req, res));

  zakazivanjeRouter
  .route("/dohvatiNaCekanju")
  .post((req, res) => new ZakazivanjeController().dohvatiNaCekanju(req, res));

  zakazivanjeRouter
  .route("/odbijNaCekanju")
  .post((req, res) => new ZakazivanjeController().odbijZakazanTermin(req, res));

  zakazivanjeRouter
  .route("/prihvatiNaCekanju")
  .post((req, res) => new ZakazivanjeController().prihvatiZakazanTermin(req, res));

  zakazivanjeRouter
  .route("/zavrsenaZakazivanjazaVlasnika")
  .post((req, res) => new ZakazivanjeController().dohvatiZavrsenaZakazivanjaZaVlasnika(req, res));

  zakazivanjeRouter
  .route("/svaZavrsenaZakazivanja")
  .get((req, res) => new ZakazivanjeController().dohvatiSvaZavrsenaZakazivanja(req, res));

  zakazivanjeRouter
  .route("/getZakazivanje")
  .post((req, res) => new ZakazivanjeController().dohvatiZakazivanje(req, res));

  zakazivanjeRouter
  .route("/addZakazivanje")
  .post((req, res) => new ZakazivanjeController().dodajZakazivanje(req, res));

  zakazivanjeRouter
  .route("/addRaspored")
  .post((req, res) => new ZakazivanjeController().postaviRaspored(req, res));

  zakazivanjeRouter
  .route("/getPrihvacenoZaRadnika")
  .post((req, res) => new ZakazivanjeController().dohvatiPrihvaceneZaRadnika(req, res));

  zakazivanjeRouter
  .route("/getPrihvacenoZaFirmu")
  .post((req, res) => new ZakazivanjeController().dohvatiPrihvaceneZaFirmu(req, res));

  zakazivanjeRouter
  .route("/getPrihvacenoZavrsenoNaCekanju")
  .get((req, res) => new ZakazivanjeController().dohvatiZavrsenoInaCekanju(req, res));

  export default zakazivanjeRouter;