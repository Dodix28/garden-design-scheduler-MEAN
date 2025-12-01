import express from "express";
import { ZahtevController, uploadMiddleware } from "../controllers/zahtev.controller";

const zahtevRouter = express.Router();

zahtevRouter
  .route("/getUsername")
  .post((req, res) => new ZahtevController().getUsername(req, res));

zahtevRouter
  .route("/getMail")
  .post((req, res) => new ZahtevController().getMail(req, res));

zahtevRouter
  .route("/addRequest")
  .post((req, res) => new ZahtevController().addRequest(req,res))

zahtevRouter
  .route("/uploadImg")
  .post(uploadMiddleware, (req,res) => new  ZahtevController().uploadImage(req,res));

zahtevRouter
  .route("/dohvatiNaCekanju")
  .get((req, res) => new ZahtevController().dohvatiNaCekanju(req, res));

zahtevRouter
.route("/accept")
.post((req, res) => new ZahtevController().acceptRequest(req,res))


zahtevRouter
  .route("/decline")
  .post((req, res) => new ZahtevController().declineRequest(req,res))


export default zahtevRouter;