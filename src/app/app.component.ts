import { Component } from '@angular/core';
import { DatastoreService } from './datastore.service';
import { JsonApiQueryData, ErrorResponse } from 'angular2-jsonapi';

import { Instructor } from './models/instructor';
import { Attr } from './models/attr';
import { Course } from './models/course';
import { Description } from './models/description';
import { MeetsWith } from './models/meets_with';
import { Special } from './models/special';
import { WhenWhere } from './models/when_where';

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
        this.datastore.instructors_select_list = data.getModels();
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
        this.datastore.attrs_select_list = data.getModels();
      },
      (errorResponse) => {
       if (errorResponse instanceof ErrorResponse) {
             // do something with errorResponse
             console.log(errorResponse.errors);
       }
    });

    this.datastore.findAll(Course, {
      include: 'attrs,description,instructors,meets_with,special,when_where'
    }).subscribe(
      (data: JsonApiQueryData<Course>) => {
        this.datastore.courses = data.getModels();
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
