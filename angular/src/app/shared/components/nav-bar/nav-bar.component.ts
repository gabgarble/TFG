import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Router,NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public items: MenuItem[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.config.forEach( route => {
      if(route.data.menuDisplay){
        this.items.push(
          {
            icon: route.data.icon,
            label: route.data.label,
            url: route.path
          }
        );
      }
    });
  }

}
