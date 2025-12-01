import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Raspored } from '../models/raspored';

@Injectable({
  providedIn: 'root'
})
export class RasporedService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:4000/raspored';

  fileRaspored: File | null = null;

  uploadRaspored(file: File){
    const formData : FormData = new FormData();
    formData.append('file',file,file.name);

    return this.http.post<Raspored>(`${this.uri}/uploadFile`,formData,{
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data'
      })
    });
  }

  setRaspored(file: File){
    this.fileRaspored = file;
  }

 getRaspored(idRaspored: number){
  const data={
    idRaspored: idRaspored
  }
  return this.http.post<Raspored>(`${this.uri}/getRaspored`,data)
 }


}
