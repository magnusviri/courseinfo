import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-instructor-select-list',
  templateUrl: './instructor-select-list.component.html',
  styleUrls: ['./instructor-select-list.component.scss']
})
export class InstructorSelectListComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;

  columnDefs;
  defaultColDef;
  rowSelection;
  suppressRowClickSelection;
  rowData: any[];
  private datastoreMessages: Subscription;

  constructor(private datastore: DatastoreService) {
    this.columnDefs = [
      {
        field: 'name',
        headerName: "Instructor",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        checkboxSelection: true,
        tooltipField: 'name',
        // cellRenderer: function(params) {
        //   var value = params.value;
        //   var link = `http://faculty.utah.edu/${params.data.unid}/teaching/index.hml/"`;
        //   value += ` <a href="${link}" target="_blank" rel="noopener"><img width="10" src="assets/external-link.svg"></a>`;
        //   return value;
        // }


      },
  //     { field: 'unid', sortable: true },
  //     { field: 'courses', sortable: true },
  //     { field: 'id' },
    ];
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById('instructorSelectListFilter')).value);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'name',
          sort: 'asc',
        },
      ],
      defaultState: { sort: null },
    });
    if ( ! this.datastore.courses ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(message => {
      if (message) {
        if (message.text == "courses_loaded") {
          this.rowData = this.datastore.instructors;
          this.datastore = this.datastore;
          this.gridApi.onFilterChanged();
        } else {
          this.gridApi.onFilterChanged();
        }
      }
      });
    } else {
      this.rowData = this.datastore.instructors;
      this.gridApi.onFilterChanged();
    }
  }

  onSelectionChanged(event) {
    this.datastore.instructor_filter = event.api.getSelectedNodes().map(item => {
      return item.data.unid;
    });
    this.datastore.sendMessage('instructor_filter_changed');
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }

}
