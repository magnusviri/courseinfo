import { Component } from '@angular/core';
import { DatastoreService } from './datastore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private datastore: DatastoreService) {
    this.datastore.loadData();
  }
}
