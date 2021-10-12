import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginService } from '../pages/login/login.service';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  layoutType: string;
  user_name:string;
  roles:string[]=[];

  constructor() { }
  
  ngOnInit() {}
  
  ngAfterViewInit() {}
}
