import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../models';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @Input()
  items: MenuItem[];

  @Output()
  itemChoosed = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public itemClicked (key: string) {
    this.itemChoosed.emit(key);
  }

}
