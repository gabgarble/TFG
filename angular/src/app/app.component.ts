import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public displayMenu: boolean = false;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    this.displayMenu = this.location.path() === '/login';
  }

  title = 'Calendar';
}
