import { Component } from '@angular/core';
import { DatastoreService } from './datastore.service';
import { JsonApiQueryData, ErrorResponse } from 'angular2-jsonapi';

import { Instructor } from './models/instructor';
import { Attr } from './models/attr';
import { Course } from './models/course';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'course info';


  constructor(private datastore: DatastoreService) {

    this.datastore.findAll(Instructor, {
    }).subscribe(
      (data: JsonApiQueryData<Instructor>) => {
        this.datastore.instructors = data.getModels();
      },
      (errorResponse) => {
       if (errorResponse instanceof ErrorResponse) {
             // do something with errorResponse
             console.log(errorResponse.errors);
       }
    });

    this.datastore.findAll(Attr, {
    }).subscribe(
      (data: JsonApiQueryData<Attr>) => {
        this.datastore.attrs = data.getModels();
      },
      (errorResponse) => {
       if (errorResponse instanceof ErrorResponse) {
             // do something with errorResponse
             console.log(errorResponse.errors);
       }
    });

    this.datastore.findAll(Course, {
      include: 'attrs,instructors'
    }).subscribe(
      (data: JsonApiQueryData<Course>) => {
        this.datastore.courses = data.getModels();
        this.datastore.makeCourseList();
        this.datastore.sendMessage('courses_loaded');
      },
      (errorResponse) => {
       if (errorResponse instanceof ErrorResponse) {
             // do something with errorResponse
             console.log(errorResponse.errors);
       }
    });

  }

}
