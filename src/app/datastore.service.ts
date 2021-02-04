import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JsonApiDatastoreConfig, JsonApiDatastore, DatastoreConfig } from 'angular2-jsonapi';
import { Observable, Subject } from 'rxjs';

import { Attr } from './models/attr';
import { Course } from './models/course';
import { Description } from './models/description';
import { Instructor } from './models/instructor';
import { MeetsWith } from './models/meets_with';
import { Special } from './models/special';
import { WhenWhere } from './models/when_where';

// import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

export interface ClassType {
  // id: number;
  name: string;
  // abr: string;
  active: boolean;
}

export interface Semester {
  id: number;
  year: number;
  season: string;
  semcode: number;
  active: boolean;
}

const config: DatastoreConfig = {
  baseUrl: 'https://courseinfo.biology.utah.edu/api',
  apiVersion: 'v1',
  models: {
    attrs: Attr,
    courses: Course,
    descriptions: Description,
    instructors: Instructor,
    meets_with: MeetsWith,
    specials: Special,
    when_where: WhenWhere
  }
}

@Injectable({
  providedIn: 'root'
})
@JsonApiDatastoreConfig(config)
export class DatastoreService extends JsonApiDatastore {

  private subscribers = new Subject<any>();

  public attr_filter: string[] = [];
  public catalog_number_filter: string[] = [];
  public class_type_filter: string[] = [];
  public course_filter: string[] = [];
  public instructor_filter: string[] = [];
  public semester_filter: string[] = [];

  public attrs_select_list: any[];
  public catalog_number_select_list: any[];
  public class_types_select_list: ClassType[];
  public course_select_list: any[];
  public instructors_select_list: any[];
  public semesters_select_list: Semester[];

  public courses: any[];
  public course_by_num: any[] = [];

  public seasons_map = {4: "Spring", 6: "Summer", 8:"Fall"};

  constructor(http: HttpClient) {
    super(http);
  }

  getCourse(course_number) {
    var course_id = this.course_by_num[course_number];
    if (course_id) {
      return this.courses[course_id];;
    } else {
      return null;
    }
  }

  sendMessage(message: string) {
    if (message == "courses_loaded") {
      this.makeCourseList();
    }
    this.subscribers.next({ text: message });
  }

  clearMessages() {
    this.subscribers.next();
  }

  onMessage(): Observable<any> {
    return this.subscribers.asObservable();
  }

  isFilterPresent() {
    var bla =
      this.attr_filter.length +
      this.class_type_filter.length +
      this.course_filter.length +
      this.catalog_number_filter.length +
      this.instructor_filter.length +
      this.semester_filter.length;
    return bla > 0;
  }

  filterCourseResults(node: any) {
    var pass = true;
    if (this.attr_filter.length > 0) {
      // Logical OR
      let ii = 0;
      let pass2 = false;
      while (ii < node.data.attrs.length) {
        pass2 = this.attr_filter.includes(node.data.attrs[ii].attr);
        if (pass2) {
          ii = node.data.attrs.length;
        } else {
          ii++;
        }
      }
      pass = pass2;
    }
    // Logical AND
    if (pass && this.class_type_filter.length > 0) {
      pass = this.class_type_filter.includes(node.data.com);
    }

    // Logical AND
    if (pass && this.course_filter.length > 0) {
      pass = this.course_filter.includes(node.data.nam);
    }
    // Logical AND
    if (pass && this.catalog_number_filter.length > 0) {
      pass = this.catalog_number_filter.includes(node.data.cat);
    }
    // Logical AND
    if (pass && this.instructor_filter.length > 0) {
      // Logical OR
      let ii = 0;
      let pass2 = false;
      while (ii < node.data.instructors.length) {
        pass2 = this.instructor_filter.includes(node.data.instructors[ii].unid);
        if (pass2) {
          ii = node.data.instructors.length;
        } else {
          ii++;
        }
      }
      pass = pass2;
    }
    // Logical AND
    if (pass && this.semester_filter.length > 0) {
      pass = this.semester_filter.includes(node.data.semcode);
    }
    return pass;
  }

  filterSelectList(list: string, key: string, filter_list: boolean[]) {
    for (var element of this[list]) {
      element.active = filter_list[element[key]];
    }
  }

  filterSelectListTrue() {
    for (var element1 of this.attrs_select_list) {
      element1.active = true;
    }
    for (var element2 of this.catalog_number_select_list) {
      element2.active = true;
    }
    for (var element3 of this.class_types_select_list) {
      element3.active = true;
    }
    for (var element4 of this.course_select_list) {
      element4.active = true;
    }
    for (var element5 of this.instructors_select_list) {
      element5.active = true;
    }
    for (var element6 of this.semesters_select_list) {
      element6.active = true;
    }
    this.sendMessage('redraw_select_lists');
  }

  makeCourseList() {
    this.course_select_list = [];
    this.catalog_number_select_list = [];
    this.class_types_select_list = [];
    let found_courses: boolean[] = [];
    let found_catalog_numbers: boolean[] = [];
    let found_class_types: boolean[] = [];

    let first_year: number = Number.MAX_VALUE;
    let last_year: number = 0;
    let last_season: number;

    this.courses.forEach((element, index) => {
      this.course_by_num[element['num']*10000+(element['yea']-1900)*10+element['sem']] = index;

      if (!(element['com'] in found_class_types)) {
        found_class_types[element['com']] = true;
        this.class_types_select_list.push({
          name: element['com'],
          // abr: '',
          active: true,
        });
      }

      if (!(element['cat'] in found_catalog_numbers)) {
        found_catalog_numbers[element['cat']] = true;
        this.catalog_number_select_list.push({
          cat: element['cat'],
          active: true,
        });
      }

      if (!(element['nam'] in found_courses)) {
        found_courses[element['nam']] = true;
        this.course_select_list.push({
          nam: element['nam'],
          active: true,
        });
      }

      if ( element['yea'] < first_year) {
        first_year = element['yea'];
      }
      if ( element['yea'] > last_year) {
        last_year = element['yea'];
        last_season = element['sem'];
      }

      if ( element['sem'] == 8 ) {
        element['Acadyr'] = (element['yea']-2)+"-"+(element['yea']-1);
      } else {
        element['Acadyr'] = (element['yea']-1)+"-"+element['yea'];
      }

      element.semester = this.seasons_map[element.sem];
      element.semcode = this.buildSemcode(element['yea'], element['sem'])
    });
    this.buildSemesterSelectList(first_year, last_year, last_season);
  }

  buildSemesterSelectList(first_year: number, last_year: number, last_season: number) {
    let id = 0;
    this.semesters_select_list = [];
    let season_num: number =last_season;
    while (season_num >= 4 ) {
      this.semesters_select_list.push({
        id: id,
        year:last_year,
        season: this.seasons_map[season_num],
        semcode: this.buildSemcode(last_year, season_num),
        active: true,
      });
      id++;
      season_num -= 2;
    }
    for (var year of this.reverse_range((last_year-1),first_year)) {
      for (var season of [8, 6, 4]) {
        this.semesters_select_list.push({
          id: id,
          year:year,
          season: this.seasons_map[season],
          semcode: this.buildSemcode(year, season),
          active: true,
        });
        id++;
      }
    }
  }

  buildSemcode(yearText:number,semester:number) {
   return (yearText - 1900) * 10 + semester;
  }

  reverse_range(start, end) {
    return Array.from({length: (start-end+1)}, (v, k) => start-k);
  }

}
