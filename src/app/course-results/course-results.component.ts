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

  //////////////////////////////////////////////////////////////////////////////////////////
  // ag-grid event handlers (all specified in template)

  // The grid has initialised. Use this event if, for example, you need to use the grid's API
  // to fix the columns to size. (named after C64...)
  // https://www.ag-grid.com/documentation/javascript/grid-events/
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
    this.paginationPageSize = this.datastore.getPref("courseResultsPaginationPageSize");
    if ( ! this.datastore.courses ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      this.rowData = this.datastore.courses;
      this.gridApi.onFilterChanged();
    }
  }

  // Called by Grid event biding and in onGridReady, and in onMessage by the messages
  // courses_loaded and select_list_changed
  // After filters have been changed via their API, you must ensure the method
  // gridApi.onFilterChanged() is called to tell the grid to filter the rows again.
  // https://www.ag-grid.com/documentation/angular/filter-api/
  // This is the start of a long process and includes redrawing everything
  onFilterChanged(event) {
    // console.log("cr onFilterChanged ----------------------------------------------------------------------------"+window.performance.now())
    // this is called after this.gridApi.onFilterChanged() is finished
    if (this.isExternalFilterPresent()) {
      this.datastore.filterHasChanged(this.gridApi);
    } else {
      this.datastore.setAllSelectListFilterItemsToActive();
    }
    // console.log("cr onFilterChanged ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"+window.performance.now())
  }

  // Called by Grid event biding and from onFilterChanged

  // External filters are the select lists
  // https://www.ag-grid.com/documentation/angular/filter-external/
  isExternalFilterPresent() {
    if (aggrid_datastore){
      return aggrid_datastore.isSelectListFilterPresent();
    }
    return false;
  }

  // Called by Grid event biding and from onFilterChanged

  // Check to see if the row is displayed or not
  doesExternalFilterPass(node) {
    if (aggrid_datastore){
      return aggrid_datastore.filterCourseResultRow(node);
    }
    return true;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // datastoreMessages subscription methods

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

  //////////////////////////////////////////////////////////////////////////////////////////

  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
    this.datastore.setPref("courseResultsPaginationPageSize", value);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // if (this.datastoreMessages && !this.datastoreMessages.closed) {
    //   this.datastoreMessages.unsubscribe();
    // }
  }

}

var aggrid_datastore = null; // because ag-grid external filters seem to run out of scope, not sure how to fix this one other than making this a global.


// router links
//https://medium.com/ag-grid/enhance-your-angular-grid-reports-with-formatted-values-and-links-34fa57ca2952
