import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { Subscription } from 'rxjs';
import { CourseDetailLinkComponent } from '../course-detail-link/course-detail-link.component';

@Component({
  selector: 'app-course-results',
  templateUrl: './course-results.component.html',
  styleUrls: ['./course-results.component.scss']
})
export class CourseResultsComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowData: any[];
  public suppressRowClickSelection;
  public paginationPageSize;
  private datastoreMessages: Subscription;

  constructor(private datastore: DatastoreService) {
    this.columnDefs = [
      {
        field: 'sem',
        headerName: 'Semester',
        maxWidth: 80,
        refData: {
          4: 'Spring',
          6: 'Summer',
          8: 'Fall',
        },
      },
      {
        field: 'yea',
        headerName: 'Year',
        maxWidth: 80,
//         filter: 'agNumberColumnFilter',
      },
      {
        field: 'cat',
        headerName: 'Catalog',
        maxWidth: 120,
//         filter: 'agNumberColumnFilter',
        // valueFormatter: function(params) {
        //   return 'BIOL '+params.value;
        // },
      },
      {
        field: 'nam',
        headerName: 'Name',
        maxWidth: 300,
        cellRendererFramework: CourseDetailLinkComponent,
        cellRendererParams: {
          inRouterLink: '/course',
        },
        tooltipField: 'nam',
      },
      {
        field: 'instructors',
        headerName: 'Instructors',
        maxWidth: 300,
        valueFormatter: function(params) {
          let names = params.value.map(element => {
            return element.name;
          });
          return names.join("; ");
        },
        tooltipValueGetter: function (params) {
          return (params.valueFormatted);
        },
      },
      {
        field: 'attrs',
        headerName: 'Attributes',
        maxWidth: 120,
        valueFormatter: function(params) {
          let names = params.value.map(element => {
            return element.attr;
          });
          return names.join(" ");
        },
        tooltipValueGetter: function (params) {
          return (params.valueFormatted);
        },
      },
      {
        field: 'com',
        headerName: 'Component',
        filter: 'agTextColumnFilter',
        maxWidth: 140,
        tooltipField: 'com',
      },
      {
        field: 'sec',
        headerName: 'Section',
        maxWidth: 80,
      },
      {
        field: 'enr',
        headerName: 'Enrolled',
        maxWidth: 80,
//         filter: 'agNumberColumnFilter',
        comparator: function(valueA, valueB) {
          if (valueA === null && valueA === null) {
            return 0;
          }
          if (valueA === null) {
            return -1;
          }
          if (valueB === null) {
            return 1;
          }
          return valueA - valueB;
        },
      },
      {
        field: 'cap',
        headerName: 'Capacity',
        maxWidth: 80,
        // filter: 'agNumberColumnFilter',
        comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
          return valueA - valueB;
        },
      },
    ];
    this.defaultColDef = {
      flex: 1,
      maxWidth: 180,
      sortingOrder: ['asc', 'desc'],
      sortable: true,
      // editable: true,
      resizable: true,
      // floatingFilter: true,
      // suppressMenu: true,
    };
    this.suppressRowClickSelection = true;
  }

  isExternalFilterPresent() {
    if (aggrid_datastore){
      var bla =
        aggrid_datastore.attr_filter.length +
        aggrid_datastore.component_filter.length +
        aggrid_datastore.course_filter.length +
        aggrid_datastore.instructor_filter.length +
        aggrid_datastore.semester_filter.length;
    }
    return bla > 0;
  }

  doesExternalFilterPass(node) {
    var pass = true;
    if (aggrid_datastore.attr_filter.length > 0) {
      // Logical OR
      let ii = 0;
      let pass2 = false;
      while (ii < node.data.attrs.length) {
        pass2 = aggrid_datastore.attr_filter.includes(node.data.attrs[ii].attr);
        if (pass2) {
          ii = node.data.attrs.length;
        } else {
          ii++;
        }
      }
      pass = pass2;
    }
    // Logical AND
    if (pass && aggrid_datastore.component_filter.length > 0) {
      pass = aggrid_datastore.component_filter.includes(node.data.com);
    }
    
    // // Logical AND
    // if (pass && aggrid_datastore.course_filter.length > 0) {
    //   // Logical OR
    //   let ii = 0;
    //   let pass2 = false;
    //   while (ii < aggrid_datastore.course_filter.length) {
    //     pass2 = node.data.nam == aggrid_datastore.course_filter[ii][0] &&
    //             node.data.cat == aggrid_datastore.course_filter[ii][1];
    //     if (pass2) {
    //       ii = aggrid_datastore.course_filter.length;
    //     } else {
    //       ii++;
    //     }
    //   }
    //   pass = pass2;
    // }

    // Logical AND
    if (pass && aggrid_datastore.course_filter.length > 0) {
      pass = aggrid_datastore.course_filter.includes(node.data.nam);
    }
    // Logical AND
    if (pass && aggrid_datastore.instructor_filter.length > 0) {
      // Logical OR
      let ii = 0;
      let pass2 = false;
      while (ii < node.data.instructors.length) {
        pass2 = aggrid_datastore.instructor_filter.includes(node.data.instructors[ii].unid);
        if (pass2) {
          ii = node.data.instructors.length;
        } else {
          ii++;
        }
      }
      pass = pass2;
    }
    // Logical AND
    if (pass && aggrid_datastore.semester_filter.length > 0) {
      pass = aggrid_datastore.semester_filter.includes(node.data.semcode);
    }
    return pass;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'yea',
          sort: 'desc',
        },
      ],
      defaultState: { sort: null },
    });
    this.paginationPageSize = 20;
    if ( ! this.datastore.courses ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(message => {
        if (message) {
          if (message.text == "courses_loaded") {
            this.rowData = this.datastore.courses;
            aggrid_datastore = this.datastore;
            this.gridApi.onFilterChanged();
          } else {
            this.gridApi.onFilterChanged();
          }
        }
      });
    } else {
      this.rowData = this.datastore.courses;
      this.gridApi.onFilterChanged();
    }
  }

  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // if (this.datastoreMessages && !this.datastoreMessages.closed) {
    //   this.datastoreMessages.unsubscribe();
    // }
  }

}

var aggrid_datastore = null; // this is needed because ag-grid external filters are wonky...


// router links
//https://medium.com/ag-grid/enhance-your-angular-grid-reports-with-formatted-values-and-links-34fa57ca2952
