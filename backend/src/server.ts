import express from 'express';
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from './routers/user.router';
import zahtevRouter from './routers/zahtev.router';
import firmaRouter from './routers/firma.router';
import zakazivanjeRouter from './routers/zakazivanje.router';
import rasporedRouter from './routers/raspored.router';
import odrzavanjeRouter from './routers/odrzavanje.router';


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/vasaBasta");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});
const router = express.Router();
router.use("/users", userRouter);
router.use("/requests", zahtevRouter);
router.use("/firme", firmaRouter);
router.use("/zakazivanje", zakazivanjeRouter);
router.use("/raspored", rasporedRouter);
router.use("/odrzavanja", odrzavanjeRouter);

app.use('/uploads', express.static(path.join(__dirname, '../src/uploads')));

app.use("/", router);
app.listen(4000, () => console.log(`Express server running on port 4000`));








/*import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(4000, () => console.log(`Express server running on port 4000`));*/