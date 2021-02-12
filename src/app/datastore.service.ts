import { CookieService } from 'ngx-cookie';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatastoreConfig, ErrorResponse, JsonApiDatastore, JsonApiDatastoreConfig, JsonApiQueryData } from 'angular2-jsonapi';
import { Observable, Subject } from 'rxjs';

import { Attr } from './models/attr';
import { Course } from './models/course';
import { Description } from './models/description';
import { Instructor } from './models/instructor';
import { MeetsWith } from './models/meets_with';
import { Special } from './models/special';
import { WhenWhere } from './models/when_where';

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
  public select_lists: {} = {
    'attr_select_list': null,
    'catalog_number_select_list': null,
    'class_type_select_list': null,
    'course_select_list': null,
    'instructor_select_list': null,
    'semester_select_list': null,
  };

  public select_list_filter: {} = {
    'attr_filter': [],
    'catalog_number_filter': [],
    'class_type_filter': [],
    'course_filter': [],
    'instructor_filter': [],
    'semester_filter': [],
  };

  public courses: any[];
  public course_by_num: any[] = [];
  private firstTime = true;

  public seasons_map = {4: 'Spring', 6: 'Summer', 8:'Fall'};

  constructor(http: HttpClient, private cookieService: CookieService) {
    super(http);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Called by smaller components

  // Called by Course Detail component
  getCourse(course_number) {
    var course_id = this.course_by_num[course_number];
    if (course_id) {
      return this.courses[course_id];;
    } else {
      return null;
    }
  }

  // Called by Welcome Component
  clearAllFilters() {
    this.sendMessage('clear_filters');
  }

  // Called by Select List Component onSelectionChanged
  selectListFilterChanged(filterName, data) {
    this.select_list_filter[filterName] = data;
    this.sendMessage('select_list_changed');
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Called by Course Results Component

  // Called by Course Results Component onFilterChanged when there IS an external filter
  // This is what changes the select lists black or grey status
  filterHasChanged(gridApi) {
    let filter_lists = [
      ['attr', 'attr_select_list'],
      ['cat', 'catalog_number_select_list'],
      ['com', 'class_type_select_list'],
      ['nam', 'course_select_list'],
      ['unid', 'instructor_select_list'],
      ['semcode', 'semester_select_list'],
    ];
    let found_fields: [] = [];
    for (var field of filter_lists) {
        found_fields[field[0]] = [];
    }
    gridApi.forEachNodeAfterFilter(function(rowNode, index) {
      rowNode.data['attrs'].map(element => {
        found_fields['attr'][element['attr']] = true;
      });
      found_fields['cat'][rowNode.data['cat']] = true;
      found_fields['com'][rowNode.data['com']] = true;
      found_fields['nam'][rowNode.data['nam']] = true;
      rowNode.data['instructors'].map(element => {
        found_fields['unid'][element['unid']] = true;
      });
      found_fields['semcode'][rowNode.data['semcode']] = true;
    });
    for (var field of filter_lists) {
      for (var element of this.select_lists[field[1]]) {
        element.active = found_fields[field[0]][element[field[0]]];
      }
    }
    this.sendMessage('redraw_select_lists');
  }

  // Called by Course Results Component onFilterChanged when there IS NOT an external filter
  setAllSelectListFilterItemsToActive() {
    for (var element1 of this.select_lists['attr_select_list']) {
      element1.active = true;
    }
    for (var element2 of this.select_lists['catalog_number_select_list']) {
      element2.active = true;
    }
    for (var element3 of this.select_lists['class_type_select_list']) {
      element3.active = true;
    }
    for (var element4 of this.select_lists['course_select_list']) {
      element4.active = true;
    }
    for (var element5 of this.select_lists['instructor_select_list']) {
      element5.active = true;
    }
    for (var element6 of this.select_lists['semester_select_list']) {
      element6.active = true;
    }
    if (this.firstTime) {
      // This is the wrong way to do this but it works until I can figure out the right way
      this.firstTime = false;
      this.sendMessage('redraw_select_lists_start');
    } else {
      this.sendMessage('redraw_select_lists');
    }
  }

  // Called by Course Results Component isExternalFilterPresent to see if there is an external filter
  isSelectListFilterPresent() {
    var count = 0;
    for (var filter in this.select_list_filter) {
      if (this.select_list_filter[filter]) {
        count += this.select_list_filter[filter].length;
      }
    }
    return count;
  }

  // Called by Course Results Component doesExternalFilterPass to see if the row is displayed or not
  filterCourseResultRow(node: any) {
    var pass = true;
    if (this.select_list_filter['attr_filter'].length > 0) {
      // Logical OR
      let ii = 0;
      let pass2 = false;
      while (ii < node.data.attrs.length) {
        pass2 = this.select_list_filter['attr_filter'].includes(node.data.attrs[ii].attr);
        if (pass2) {
          ii = node.data.attrs.length;
        } else {
          ii++;
        }
      }
      pass = pass2;
    }
    // Logical AND
    if (pass && this.select_list_filter['class_type_filter'].length > 0) {
      pass = this.select_list_filter['class_type_filter'].includes(node.data.com);
    }

    // Logical AND
    if (pass && this.select_list_filter['course_filter'].length > 0) {
      pass = this.select_list_filter['course_filter'].includes(node.data.nam);
    }
    // Logical AND
    if (pass && this.select_list_filter['catalog_number_filter'].length > 0) {
      pass = this.select_list_filter['catalog_number_filter'].includes(node.data.cat);
    }
    // Logical AND
    if (pass && this.select_list_filter['instructor_filter'].length > 0) {
      // Logical OR
      let ii = 0;
      let pass2 = false;
      while (ii < node.data.instructors.length) {
        pass2 = this.select_list_filter['instructor_filter'].includes(node.data.instructors[ii].unid);
        if (pass2) {
          ii = node.data.instructors.length;
        } else {
          ii++;
        }
      }
      pass = pass2;
    }
    // Logical AND
    if (pass && this.select_list_filter['semester_filter'].length > 0) {
      pass = this.select_list_filter['semester_filter'].includes(node.data.semcode);
    }
    return pass;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Yum yum! COokies!

  setPref(name, value) {
    this.cookieService.put(name, value);
  }

  getPref(name) {
    let value = this.cookieService.get(name);
    if (value == null) {
      switch(name) {
        case "courseResultsPaginationPageSize":
          value = "20";
          break;
        case "loadYears":
          value = "5";
          break;
        default:
          value = "";
          break;
      }
    }
    return value;
  }

  setPrefObj(name, value) {
    this.cookieService.putObject(name, value);
  }

  getPrefObj(name) {
    let value = this.cookieService.getObject(name);
    return value;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // datastoreMessages

  onMessage(): Observable<any> {
    return this.subscribers.asObservable();
  }

  sendMessage(message: string) {
    this.subscribers.next({ text: message });
  }

  clearMessages() {
    this.subscribers.next();
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Called by App Component

  loadData() {
    let loadYears = this.getPref("loadYears");
    let filter = {};
    if ( loadYears && ! isNaN(Number(loadYears)) ) {
      filter = { years: loadYears }
    }
    this.findAll(Course, {
      include: 'attrs,description,instructors,meets_with,special,when_where',
      filter: filter,
    }).subscribe(
      (data: JsonApiQueryData<Course>) => {
        this.courses = data.getModels();
        this.makeCourseListAndFilters();
        this.sendMessage('courses_loaded');
      },
      (errorResponse) => {
       if (errorResponse instanceof ErrorResponse) {
             // do something with errorResponse
             console.log(errorResponse.errors);
       }
    });
  }

  // Called by loadData
  makeCourseListAndFilters() {
    // Loop through all the courses and get all the needed info and make other changes.
    let filter_lists = ['attr', 'cat', 'com', 'unid', 'nam'];
    let found_fields: [] = [];
    for (var field of filter_lists) {
        found_fields[field] = [];
    }
    let first_year: number = Number.MAX_VALUE;
    let last_year: number = 0;
    let last_season: number;
    this.courses.forEach((course, index) => {
      this.course_by_num[course['num']*10000+(course['yea']-1900)*10+course['sem']] = index;
      for (var element of course['attrs']) {
        if (!(course['attr'] in found_fields['attr'])) {
          found_fields['attr'][element['attr']] = {
            attr: element['attr'],
            active: true,
          };
        }
      }
      if (!(course['cat'] in found_fields['cat'])) {
        found_fields['cat'][course['cat']] = {
          cat: course['cat'],
          active: true,
        };
      }
      if (!(course['com'] in found_fields['com'])) {
        found_fields['com'][course['com']] = {
          com: course['com'],
          // abr: '',
          active: true,
        };
      }
      if (!(course['nam'] in found_fields['nam'])) {
        found_fields['nam'][course['nam']] = {
          nam: course['nam'],
          active: true,
        };
      }
      for (var element of course['instructors']) {
        if (!(element['unid'] in found_fields['unid'])) {
          found_fields['unid'][element['unid']] = {
            unid: element['unid'],
            name: element['name'],
            active: true,
          };
        }
      }
      if ( course['yea'] < first_year) {
        first_year = course['yea'];
      }
      if ( course['yea'] > last_year) {
        last_year = course['yea'];
        last_season = course['sem'];
      }
      course.semester = this.seasons_map[course.sem];
      course.semcode = this.buildSemcode(course['yea'], course['sem'])
    });

    // Create filter lists
    this.select_lists['attr_select_list'] = [];
    for (var value in found_fields['attr']) {
      this.select_lists['attr_select_list'].push(found_fields['attr'][value]);
    }
    this.select_lists['catalog_number_select_list'] = [];
    for (var value in found_fields['cat']) {
      this.select_lists['catalog_number_select_list'].push(found_fields['cat'][value]);
    }
    this.select_lists['class_type_select_list'] = [];
    for (var value in found_fields['com']) {
      this.select_lists['class_type_select_list'].push(found_fields['com'][value]);
    }
    this.select_lists['course_select_list'] = [];
    for (var value in found_fields['nam']) {
      this.select_lists['course_select_list'].push(found_fields['nam'][value]);
    }
    this.select_lists['instructor_select_list'] = [];
    for (var value in found_fields['unid']) {
      this.select_lists['instructor_select_list'].push(found_fields['unid'][value]);
    }
    this.buildSemesterSelectList(first_year, last_year, last_season);
  }

  // Called by makeCourseListAndFilters
  buildSemesterSelectList(first_year: number, last_year: number, last_season: number) {
    let id = 0;
    this.select_lists['semester_select_list'] = [];
    let season_num: number =last_season;
    while (season_num >= 4 ) {
      this.select_lists['semester_select_list'].push({
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
        this.select_lists['semester_select_list'].push({
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

  // Called by makeCourseListAndFilters and buildSemesterSelectList
  buildSemcode(yearText:number,semester:number) {
   return (yearText - 1900) * 10 + semester;
  }

  // Called by buildSemesterSelectList
  reverse_range(start, end) {
    return Array.from({length: (start-end+1)}, (v, k) => start-k);
  }

}
