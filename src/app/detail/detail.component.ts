import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { ActivatedRoute, NavigationStart, NavigationEnd, Router } from '@angular/router';

import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  public course: any;
  displayMessage = false;
  message = "";
  capacity:number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public backend: BackendService,
  ) { }

  ngOnInit() {
    console.log("DetailComponent ngOnInit start");
    this.route.paramMap.subscribe(params => {
      console.log("DetailComponent ngOnInit getting params");
      this.course = this.backend.getCourse(Number(params.get('courseId')));
      // courseIds[params.get('courseId')];

      console.log(this.course);
      console.log(params);
    });


    console.log("DetailComponent ngOnInit end");

    this.router.events.subscribe(evt => { 
      if (evt instanceof NavigationStart) {
        this.message = 'Loading...';
        this.displayMessage = true;
      }
      if (evt instanceof NavigationEnd) this.displayMessage = false;
    });
  

  }

}
