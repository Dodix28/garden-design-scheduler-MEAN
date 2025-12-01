import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dekorater',
  templateUrl: './dekorater.component.html',
  styleUrls: ['./dekorater.component.css']
})
export class DekoraterComponent implements OnInit {

constructor(private router: Router){}

ngOnInit(): void {

}

  odjava(){
    localStorage.removeItem('ulogovan');
    this.router.navigate(['']);
  }

}
