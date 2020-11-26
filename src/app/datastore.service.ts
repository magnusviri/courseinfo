import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { Semester } from './datastore/semester';
import { Instructor } from './datastore/instructor';
import { GenEd } from './datastore/gened';
import { Course } from './datastore/course';

import { GENEDS } from './datastore/geneds-stub';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public data: any = [];
  public instructors: Instructor[] = [];
  public courseList: Course[] = [];
  public courseIds: Course[] = [];
  public geneds: GenEd[] = [];
  public semesters: Semester[] = [];
  private loadedJSON: number[] = [];
  public gridApi: any;
  private foundData: any = {'ins':{},'cat':{}};

  constructor(private httpClient: HttpClient) {}

  getCourse(tempId: number) {
    return this.courseIds[tempId];
  }

  loadSemesters(semcodes: number[]) {
    for (const semcode of semcodes) {
      if (!this.loadedJSON[semcode]) {
        console.log(semcode);
        this.httpClient.get(`assets/${semcode}.json`).subscribe(httpData =>{
          for (var ii in httpData ) {
            // console.log(httpData[ii]);
            var id = httpData[ii]['num']*10000+(httpData[ii]['yea']-1900)*10+httpData[ii]['sem']
            httpData[ii]["id"] = id;
            this.courseIds[id] = httpData[ii];
            if ( httpData[ii]["num"] ) {
              let cat:string = httpData[ii]["cat"];
              if (!this.foundData['cat'][cat]) {
                this.foundData['cat'][cat] = 1;
                this.courseList.push({name:httpData[ii]["nam"], catalog:Number(cat)});
              }
            }
            if ( httpData[ii]["ins"] ) {
              for (var jj in httpData[ii]["ins"] ) {
                let name:string = httpData[ii]["ins"][jj][0];
                if (!this.foundData['ins'][name]) {
                  this.foundData['ins'][name] = httpData[ii]["ins"][jj][1];
                  this.instructors.push({name:name, unid:httpData[ii]["ins"][jj][1]});
                }
              }
            }
          }
          this.data = this.data.concat(httpData);
          if ( this.gridApi ) {
            this.gridApi.setRowData(this.data);
          }
          this.loadedJSON[semcode] = 1;
          this.instructors.sort(function (a, b) {
            let val1: string = a.name.toLowerCase();
            let val2: string = b.name.toLowerCase();
            if (val1 > val2) {return 1;}
            if (val1 < val2) {return -1;}
            return 0;
          });
          // console.log(this.foundData['ins']);
          this.geneds.sort(function (a, b) {
            let val1: string = a.name.toLowerCase();
            let val2: string = b.name.toLowerCase();
            if (val1 > val2) {return 1;}
            if (val1 < val2) {return -1;}
            return 0;
          });
          // this.courseList.sort(function (a: Course, b: Course) {
          //   let val1: number= a.catalog;
          //   let val2: number = b.catalog;
          //   if (val1 > val2) {return 1;}
          //   if (val1 < val2) {return -1;}
          //   return 0;
          // });
          console.log(this.loadedJSON);
          this.geneds = GENEDS;
        });
      }
    }
  }


  buildSemesters() {
    let start_year = 2014;
    let id = 0;
    for (var year of this.reverse_range(2020,1999)) {
      for (var season of ["Fall", "Summer", "Spring"]) {
        this.semesters.push({id: id, year:year, season: season, code: this.buildSemcode(year, season)});
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

}
