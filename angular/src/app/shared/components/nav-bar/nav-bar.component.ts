import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {

    this.router.config.forEach((route) => {
      this.items.push({
        id: route.path,
        icon: route.data.icon,
        label: route.data.label,
        visible: route.data.menuDisplay,
        routerLink: route.path
      });
    });

  }
}
