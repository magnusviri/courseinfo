import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-semester-select-list',
  templateUrl: './semester-select-list.component.html',
  styleUrls: ['./semester-select-list.component.scss']
})
export class SemesterSelectListComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;
  public rowClassRules;
  public postSort;
  public semesterSelectListFilter = "";

  columnDefs;
  defaultColDef;
  rowSelection;
  suppressRowClickSelection;
  rowData: any[];
  private datastoreMessages: Subscription;

  constructor(private datastore: DatastoreService, private cookieService: CookieService) {
    this.columnDefs = [
      {
        field: "semcode",
        headerName: "Semester",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        checkboxSelection: true,
        getQuickFilterText: function(params) {
          return params.data.year+' '+params.data.season;
        },
        // cellRenderer: function(params) {
        //   var value = `${params.data.year} ${params.data.season}`;
        //   var catalog_link = `https://student.apps.utah.edu/uofu/stu/ClassSchedules/main/${params.value}/class_list.html?subject=BIOL"`;
        //   value += ` <a href="${catalog_link}" target="_blank" rel="noopener"><img width="10" src="assets/external-link.svg"></a>`;
        //   return value;
        // }

        valueFormatter: function(params) {
          var value = `${params.data.year} ${params.data.season}`;
          return value;
        },

      },
    ];
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
    this.postSort = function (rowNodes) {
      function move(toIndex, fromIndex) {
        rowNodes.splice(toIndex, 0, rowNodes.splice(fromIndex, 1)[0]);
      }
      var nextInsertPos = 0;
      for (var i = 0; i < rowNodes.length; i++) {
        if (rowNodes[i].data.active) {
          move(nextInsertPos, i);
          nextInsertPos++;
        }
      }
    };
  }

  onQuickFilterChanged() {
    let value = (<HTMLInputElement>document.getElementById('semesterSelectListFilter')).value;
    this.gridApi.setQuickFilter(value);
    this.cookieService.put("semesterSelectListFilter", value);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'semcode',
          sort: 'desc',
        },
      ],
      defaultState: { sort: null },
    });
    if ( ! this.datastore.semesters_select_list ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      this.rowData = this.datastore.semesters_select_list;
      this.gridApi.onFilterChanged();
    }
    this.rowClassRules = {
      "select-list-inactive-element": function (params) {
        return !params.data.active;
      },
    };
  }

  onMessage(message) {
    if (message) {
      if (message.text == "courses_loaded") {
        this.semesterSelectListFilter = this.cookieService.get("semesterSelectListFilter") || "";
        this.gridApi.setQuickFilter(this.semesterSelectListFilter);
        this.rowData = this.datastore.semesters_select_list;
      } else if (message.text == "redraw_select_lists") {
        this.gridApi.onFilterChanged();
        this.gridApi.redrawRows();
      }
    }
  }

  onSelectionChanged(event) {
    this.datastore.semester_filter = event.api.getSelectedNodes().map(item => {
      return item.data.semcode;
    });
    this.datastore.sendMessage('select_list_changed');
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }
}
