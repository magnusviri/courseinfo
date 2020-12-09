import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-semester-select-list',
  templateUrl: './semester-select-list.component.html',
  styleUrls: ['./semester-select-list.component.scss']
})
export class SemesterSelectListComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;

  columnDefs;
  defaultColDef;
  rowSelection;
  suppressRowClickSelection;
  rowData: any[];
  private datastoreMessages: Subscription;

  constructor(public datastore: DatastoreService) {
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
        cellRenderer: function(params) {
          var value = `${params.data.year} ${params.data.season}`;
          var catalog_link = `https://student.apps.utah.edu/uofu/stu/ClassSchedules/main/${params.value}/class_list.html?subject=BIOL"`;
          value += ` <a href="${catalog_link}" target="_blank" rel="noopener"><img width="10" src="assets/external-link.svg"></a>`;
          return value;
        }

        // cellRendererParams: {
        //   inRouterLink: '/course',
        //   // id: id,
        // },

      },
    ];
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
    this.suppressRowClickSelection = true;
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById('semesterSelectListFilter')).value);
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
    if ( ! this.datastore.semesters ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(message => {
        if (message) {
          if (message.text == "courses_loaded") {
            this.rowData = this.datastore.semesters;
            this.gridApi.onFilterChanged();
          } else {
            this.gridApi.onFilterChanged();
          }
        }
      });
    } else {
      this.rowData = this.datastore.semesters;
      this.gridApi.onFilterChanged();
    }
  }

  onSelectionChanged(event) {
    this.datastore.semester_filter = event.api.getSelectedNodes().map(item => {
      return item.data.semcode;
    });
    console.log(this.datastore.semester_filter);
    this.datastore.sendMessage('semester_filter_changed');
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }
}
