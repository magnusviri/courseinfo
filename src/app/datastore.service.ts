import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonApiDatastoreConfig, JsonApiDatastore, DatastoreConfig } from 'angular2-jsonapi';
import { Observable, Subject } from 'rxjs';

import { Attr } from './models/attr';
import { Course } from './models/course';
import { Instructor } from './models/instructor';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

export interface Semester {
  id: number;
  year: number;
  season: string;
  semcode: number;
}

const config: DatastoreConfig = {
  baseUrl: 'https://courseinfo.biology.utah.edu/api',
  apiVersion: 'v1',
  models: {
    attrs: Attr,
    courses: Course,
    instructors: Instructor
  }
}

@Injectable({
  providedIn: 'root'
})
@JsonApiDatastoreConfig(config)
export class DatastoreService extends JsonApiDatastore {

  private subject = new Subject<any>();

  public attr_filter: [] = [];
  public course_filter: [] = [];
  public instructor_filter: [] = [];
  public semester_filter: [] = [];
  public semesters: Semester[];
  public attrs: any[];
  public courses: any[];
  public course_by_num: any[] = [];
  public course_list: any[];
  public found_courses: boolean[] = [];
  public instructors: any[];
  public first_year: Number = Number.MAX_VALUE;
  public last_year: Number = 0;

  constructor(http: HttpClient) {
    super(http);
  }

  sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  clearMessages() {
    this.subject.next();
  }

  onMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  buildSemesters() {
    let id = 0;
    this.semesters = [];
    for (var year of this.reverse_range(this.last_year,this.first_year)) {
      for (var season of ["Fall", "Summer", "Spring"]) {
        this.semesters.push({id: id, year:year, season: season, semcode: this.buildSemcode(year, season)});
        id++;
      }
    }
  }

  buildSemcode(yearText:number,semesterText:string) {
    let year = (yearText-1900)*10;
    let semester = 0;
    switch(semesterText) {
      case "Spring": {
        semester = 4;
        break;
      }
      case "Summer": {
        semester = 6;
        break;
      }
      case "Fall": {
        semester = 8;
        break;
      }
   }
   return year+semester;
  }

  reverse_range(start, end) {
    return Array.from({length: (start-end+1)}, (v, k) => start-k);
  }

  makeCourseList() {
    this.course_list = [];
    this.courses.forEach((element, index) => {
      this.course_by_num[element['num']*10000+(element['yea']-1900)*10+element['sem']] = index;

      if (element.sem == 4) {
        element.semester = "Spring";
      } else if (element.sem == 6) {
        element.semester = "Summer";
      } else if (element.sem == 8) {
        element.semester = "Fall";
      }

      if (element.sec < 10) {
        element.section = "00"+element.sec;
      } else if (element.sec < 100) {
        element.section = "0"+element.sec;
      }

      element.semcode = (element['yea']-1900)*10+element['sem'];
      this.buildSemcode(element['yea'], element['sem']);
      if(!(element['cat']+element['nam'] in this.found_courses)) {
        this.found_courses[element['cat']+element['nam']] = true;
        this.course_list.push({'nam': element['nam'],'cat': element['cat']});

        if ( element['yea'] < this.first_year) {
          this.first_year = element['yea'];
        }
        if ( element['yea'] > this.last_year) {
          this.last_year = element['yea'];
        }
      }
    });
    this.buildSemesters();
  }

  getCourse(course_number) {
    var course_id = this.course_by_num[course_number];
    if (course_id) {
      return this.courses[course_id];;
    } else {
      return null;
    }
  }

}
