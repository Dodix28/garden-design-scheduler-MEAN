import express from "express";
import { RasporedController,uploadFileJson } from "../controllers/raspored.controller";

const rasporedRouter = express.Router();

rasporedRouter
  .route("/uploadFile")
  .post(uploadFileJson, (req, res) => new RasporedController().addRaspored(req,res))

  
  rasporedRouter
  .route("/getRaspored")
  .post((req,res) => new RasporedController().getRaspored(req,res));



  export default rasporedRouter;