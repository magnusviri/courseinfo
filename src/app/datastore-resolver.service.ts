import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { BackendService } from './datastore.service';

@Injectable({
  providedIn: 'root'
})
export class BackendResolverService implements Resolve<any> {

  constructor(private backendService: BackendService) { }
  
  resolve() {
    // return this.backendService.loadSemesters();
  }
}
