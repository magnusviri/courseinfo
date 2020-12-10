import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attr-select-list',
  templateUrl: './attr-select-list.component.html',
  styleUrls: ['./attr-select-list.component.scss']
})
export class AttrSelectListComponent implements OnInit, OnDestroy {
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
        field: 'attr',
        headerName: "Course Attribute",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        checkboxSelection: true,
        tooltipField: 'attr',
        // valueFormatter: function(params) {
        //   console.log(params);
        //   return params.value+' '+params.data.season;
        // },
      },
  //     { field: 'desc', sortable: true },
  //     { field: 'courses', sortable: true },
  //     {   field: 'id' },
    ];
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById('attrSelectListFilter')).value);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'attr',
          sort: 'asc',
        },
      ],
      defaultState: { sort: null },
    });
    if ( ! this.datastore.attrs ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(message => {
        if (message) {
          if (message.text == "courses_loaded") {
            this.rowData = this.datastore.attrs;
            this.gridApi.onFilterChanged();
          } else {
            this.gridApi.onFilterChanged();
          }
        }
      });
    } else {
      this.rowData = this.datastore.attrs;
      this.gridApi.onFilterChanged();
    }
  }

  onSelectionChanged(event) {
    this.datastore.attr_filter = event.api.getSelectedNodes().map(item => {
      return item.data.attr;
    });
    this.datastore.sendMessage('attr_filter_changed');
  }

  ngOnInit(): void {
  }


  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }
}

// https://catalog.utah.edu/#/programs/HkpBsMW6z?bc=true&bcCurrent=Bachelor%20Degree%20Program&bcItemType=programs
// https://catalog.utah.edu/#/programs/HkpBsMW6z?bc=true&bcCurrent=General%20Education%20Program&bcItemType=programs
