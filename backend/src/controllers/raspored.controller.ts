import * as express from "express";
import RasporedModel from "../models/raspored"
import multer from  "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadFileJson = upload.single('file');

export class RasporedController {

    addRaspored = async (req: express.Request, res: express.Response) =>  {
        let max = await RasporedModel.find({}).sort({ idRaspored: -1 }).limit(1);
       
        let x;
            if (max.length > 0) {
                x = max[0].idRaspored + 1;
            } else {
                x = 1;
            }
        if(req.file != null){
            const rasporedData = JSON.parse(req.file.buffer.toString())[0];
            console.log("Parsed JSON data:", rasporedData);
            console.log("Parsed JSON data properties:", {
                tipBaste: rasporedData.tipBaste,
                zelenila: rasporedData.zelenila,
                bazeni: rasporedData.bazeni,
                stolovi: rasporedData.stolovi,
                stolice: rasporedData.stolice,
                fontane: rasporedData.fontane
            });
            /*const raspored = new RasporedModel({
                idRaspored: x, ...rasporedData});*/
                const raspored = new RasporedModel({
                    idRaspored: x,
                    tipBaste: rasporedData.tipBaste,
                    zelenila: rasporedData.zelenila,
                    bazeni: rasporedData.bazeni,
                    stolovi: rasporedData.stolovi,
                    stolice: rasporedData.stolice,
                    fontane: rasporedData.fontane
                });
                console.log("raspored data basta",rasporedData.tipBaste)
                console.log("noviraspored za dodavanje",raspored);
                console.log("najveci max",max);
                console.log("najveci id",x);
        await  raspored.save()
        .then(raspored => {console.log("sacuvani raspored",raspored); res.json(raspored); })
        .catch((err) => console.error('Greška prilikom findOneAndUpdate:', err));
        }
     }

     getRaspored = (req: express.Request, res: express.Response) => {
        let idRaspored = req.body.idRaspored;

        RasporedModel.find({idRaspored: idRaspored})
        .then((raspored) => { res.json(raspored) ; })
        .catch((err) => console.log(err));
     }
}