import express from "express";
import { UserController, uploadMiddleware} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter
  .route("/login")
  .post((req, res) => new UserController().login(req, res));

  userRouter
  .route("/getUsername")
  .post((req, res) => new UserController().getUsername(req, res));

  userRouter
  .route("/getMail")
  .post((req, res) => new UserController().getMail(req, res));

  userRouter
  .route("/getPassword")
  .post((req,res) => new UserController().getPassword(req,res));

  userRouter
  .route("/updatePassword")
  .post((req,res) => new UserController().updatePassword(req,res));

  userRouter
  .route("/updateInfo")
  .post((req,res) => new UserController().updateInfoUser(req,res));

  //specijalno samo za azuriranje profilne
  userRouter
  .route("/uploadImage")
  .post(uploadMiddleware, (req,res) => new  UserController().uploadImage(req,res));

  userRouter
  .route("/dohvatiSveVlasnike")
  .get((req,res) => new UserController().dohvatiSveVlasnike(req,res));

  userRouter
  .route("/dohvatiSveDekoratere")
  .get((req,res) => new UserController().dohvatiSveDekoratere(req,res));

  userRouter
  .route("/addUser")
  .post((req,res) => new  UserController().addUser(req,res));

  userRouter
  .route("/getByName")
  .post((req,res) => new  UserController().getByName(req,res));


export default userRouter;