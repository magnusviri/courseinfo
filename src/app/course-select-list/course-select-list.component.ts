import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-course-select-list',
  templateUrl: './course-select-list.component.html',
  styleUrls: ['./course-select-list.component.scss']
})
export class CourseSelectListComponent implements OnInit, OnDestroy {
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
        field: 'cat',
        headerName: '#',
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        tooltipField: 'cat',
        maxWidth: 90,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      {
        field: 'nam',
        headerName: 'Course Name',
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        tooltipField: 'nam',
      },
    ];
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
    this.suppressRowClickSelection = true;
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById('courseSelectListFilter')).value);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'cat',
          sort: 'asc',
        },
      ],
      defaultState: { sort: null },
    });
    if ( ! this.datastore.course_list ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(message => {
        if (message) {
          if (message.text == "courses_loaded") {
            this.rowData = this.datastore.course_list;
            this.gridApi.onFilterChanged();
          } else {
            this.gridApi.onFilterChanged();
          }
        }
      });
    } else {
      this.rowData = this.datastore.course_list;
      this.gridApi.onFilterChanged();
    }
  }

  onSelectionChanged(event) {
    this.datastore.course_filter = event.api.getSelectedNodes().map(item => {
      return item.data.nam;
    });
    this.datastore.sendMessage('course_filter_changed');
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }

}
