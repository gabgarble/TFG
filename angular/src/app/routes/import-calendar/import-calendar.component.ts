import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-import-calendar',
  templateUrl: './import-calendar.component.html',
  styleUrls: ['./import-calendar.component.scss']
})
export class ImportCalendarComponent implements OnInit {

  public importCalendarForm: FormGroup;

  public calendarCols: any[] = [
    {field: "name", header: "Name"},
    {field: "platform", header: "Platform"},
    {field: "active", header: "Active"}
  ];

  public calendars: any[] = [
    {name: "Calendar 1", platform: "Google", active: true},
    {name: "Calendar 2", platform: "Google", active: true},
    {name: "Calendar 3", platform: "Apple", active: false}
  ];

  public platforms: any[] = [{label: "Google", value: 1},{label: "Apple", value: 2},{label: "Doodle", value: 3}]

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initImportCalendarForm();
  }

  public initImportCalendarForm () {
    this.importCalendarForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'platform': [null, Validators.required],
      'active': [null, Validators.required]
    });
  }

}
