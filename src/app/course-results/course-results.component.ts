import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
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

  constructor(private datastore: DatastoreService, private cookieService: CookieService) {
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
      },
      {
        field: 'sub',
        headerName: 'Subject',
        maxWidth: 120,
      },
      {
        field: 'cat',
        headerName: 'Catalog',
        maxWidth: 120,
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
        comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
          let nameA = valueA.map(element => {
            return element.name;
          });
          nameA = nameA.sort().join('; ');
          let nameB = valueB.map(element => {
            return element.name;
          });
          nameB = nameB.sort().join('; ');
          if (nameA == nameB) {
            return 0;
          } else {
            return (nameA>nameB) ? 1 : -1;
          }
        },

        valueFormatter: function(params) {
          let names = params.value.map(element => {
            return element.name;
          });
          return names.sort().join('; ');
        },
        tooltipValueGetter: function (params) {
          return (params.valueFormatted);
        },
      },
      // {
      //   field: 'attrs',
      //   headerName: 'Attributes',
      //   maxWidth: 120,
      //   valueFormatter: function(params) {
      //     let names = params.value.map(element => {
      //       return element.attr;
      //     });
      //     return names.sort().join(' ');
      //   },
      //   tooltipValueGetter: function (params) {
      //     return (params.valueFormatted);
      //   },
      // },
      {
        field: 'com',
        headerName: 'Class Type',
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
    };
    this.suppressRowClickSelection = true;
  }

  isExternalFilterPresent() {
    if (aggrid_datastore){
      return aggrid_datastore.isFilterPresent();
    }
    return false;
  }

  doesExternalFilterPass(node) {
    if (aggrid_datastore){
      return aggrid_datastore.filterCourseResults(node);
    }
    return true;
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
    this.paginationPageSize = this.cookieService.get("courseResultsPaginationPageSize") || 20;
    if ( ! this.datastore.courses ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      this.rowData = this.datastore.courses;
      this.gridApi.onFilterChanged();
    }
  }

  onMessage(message) {
    if (message) {
      if (message.text == 'courses_loaded') {
        this.rowData = this.datastore.courses;
        aggrid_datastore = this.datastore;
        this.gridApi.onFilterChanged();
      } else if (message.text == 'select_list_changed') {
        this.gridApi.onFilterChanged();
      }
    }
  }

  onFilterChanged(event) {
    // this is called after this.gridApi.onFilterChanged() is finished
    if (this.isExternalFilterPresent()) {
      let attr_filters: boolean[] = [];
      let catalog_number_filters: boolean[] = [];
      let class_type_filters: boolean[] = [];
      let course_filters: boolean[] = [];
      let semester_filters: boolean[] = [];
      let instructor_filters: boolean[] = [];
      this.gridApi.forEachNodeAfterFilter(function(rowNode, index) {
        rowNode.data.attrs.map(element => {
          attr_filters[element.attr] = true;
        });
        catalog_number_filters[rowNode.data.cat] = true;
        class_type_filters[rowNode.data.com] = true;
        course_filters[rowNode.data.nam] = true;
        rowNode.data.instructors.map(element => {
          instructor_filters[element.unid] = true;
        });
        semester_filters[rowNode.data.semcode] = true;
      });
      this.datastore.filterSelectList('attr_select_list', 'attr', attr_filters);
      this.datastore.filterSelectList('catalog_number_select_list', 'cat', catalog_number_filters);
      this.datastore.filterSelectList('class_type_select_list', 'name', class_type_filters);
      this.datastore.filterSelectList('course_select_list', 'nam', course_filters);
      this.datastore.filterSelectList('instructor_select_list', 'unid', instructor_filters);
      this.datastore.filterSelectList('semester_select_list', 'semcode', semester_filters);
      this.datastore.sendMessage('redraw_select_lists');
    } else {
      this.datastore.filterSelectListTrue();
    }
  }

  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
    this.cookieService.put("courseResultsPaginationPageSize", value);
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
