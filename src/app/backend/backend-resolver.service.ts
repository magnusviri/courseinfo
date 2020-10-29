import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class BackendResolverService implements Resolve<any> {

  constructor(private backendService: BackendService) { }
  
  resolve() {
    // return this.backendService.loadSemesters();
  }
}
