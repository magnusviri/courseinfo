import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-component-select-list',
  templateUrl: './component-select-list.component.html',
  styleUrls: ['./component-select-list.component.scss']
})
export class ComponentSelectListComponent implements OnInit, OnDestroy {
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
        field: "name",
        headerName: "Component",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        checkboxSelection: true,
      },
    ];
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById('componentSelectListFilter')).value);
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
    if ( ! this.datastore.components ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(message => {
        if (message) {
          if (message.text == "courses_loaded") {
            this.rowData = this.datastore.components;
            this.gridApi.onFilterChanged();
          } else {
            this.gridApi.onFilterChanged();
          }
        }
      });
    } else {
      this.rowData = this.datastore.components;
      this.gridApi.onFilterChanged();
    }
  }

  onSelectionChanged(event) {
    this.datastore.component_filter = event.api.getSelectedNodes().map(item => {
      return item.data.name;
    });
    console.log(this.datastore.component_filter);
    this.datastore.sendMessage('component_filter_changed');
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }
}
