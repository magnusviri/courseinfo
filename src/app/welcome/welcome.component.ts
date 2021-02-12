import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public loadYears;

  constructor(private datastore: DatastoreService) {}

  ngOnInit(): void {
    this.loadYears = this.datastore.getPref('loadYears');
  }

  onLoadYearsChanged() {
    var value = (<HTMLInputElement>document.getElementById('load-years')).value;
    this.datastore.setPref('loadYears', value);
    alert("You must manually reload the page to effect this change.");
  }

  clearAllFilters() {
    this.datastore.clearAllFilters();
  }
}
