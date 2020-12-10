import { Component, OnInit, OnDestroy } from '@angular/core';

import { DatastoreService } from '../datastore.service';
import { ActivatedRoute, NavigationStart, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  public course: any;
  displayLoading = false;
  displayError = false;
  capacity:number;
  private datastoreMessages: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public datastore: DatastoreService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var course_number = Number(params.get('course_number'));
      this.course = this.datastore.getCourse(course_number);
      if (!this.course) {
        this.displayError = false;
        this.displayLoading = true;
        this.datastoreMessages = this.datastore.onMessage().subscribe(message => {
          if (message) {
            if (message.text == "courses_loaded") {
              this.course = this.datastore.getCourse(course_number);
              if (this.course) {
                this.datastoreMessages.unsubscribe();
                this.displayLoading = false;
              } else {
                this.displayError = true;
                this.displayLoading = false;
                console.log("Could not find " + params.get('course_number'));
              }
            }
          }
        });
      }
    });
    this.router.events.subscribe(event => {
      this.displayError = false;
      if (event instanceof NavigationStart) {
        this.displayLoading = true;
      } else if (event instanceof NavigationEnd) {
        if (this.course) {
        this.displayLoading = false;
        }
      }
    });

  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }

}
