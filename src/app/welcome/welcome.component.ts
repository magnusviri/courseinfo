import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private datastore: DatastoreService) {}

  ngOnInit(): void {
  }

  clearAllFilters() {
    this.datastore.clearAllFilters();
  }
}
