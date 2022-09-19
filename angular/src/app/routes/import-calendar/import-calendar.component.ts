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
    {name: "Account Calendar", platform: "Google", description: "Calendar from the account ggbleda", active: true},
    //{name: "Calendar 2", platform: "Google", active: true},
  ];

  public selectedCalendar: any;
  public disable: boolean = false;

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
      'description': [null, []],
      'platform': [null, Validators.required],
      'active': [null, Validators.required]
    });
  }

  onRowSelect(event: any) {
    this.importCalendarForm.patchValue(event.data);
    this.disable = true;
  }

  onRowUnselect(event: any) {
    this.importCalendarForm.reset();
    this.disable = false;
  }

}
