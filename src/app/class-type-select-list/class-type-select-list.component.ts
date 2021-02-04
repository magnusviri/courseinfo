import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-class-type-select-list',
  templateUrl: './class-type-select-list.component.html',
  styleUrls: ['./class-type-select-list.component.scss']
})
export class ClassTypeSelectListComponent implements OnInit, OnDestroy {
  private gridApi;
  private gridColumnApi;
  public rowClassRules;
  public postSort;
  public classTypeSelectListFilter = "";

  columnDefs;
  defaultColDef;
  rowSelection;
  suppressRowClickSelection;
  rowData: any[];
  private datastoreMessages: Subscription;

  constructor(private datastore: DatastoreService, private cookieService: CookieService) {
    this.columnDefs = [
      {
        field: 'name',
        headerName: 'Class Type',
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
    let value = (<HTMLInputElement>document.getElementById('classTypeSelectListFilter')).value;
    this.gridApi.setQuickFilter(value);
    this.cookieService.put("classTypeSelectListFilter", value);
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
    if ( ! this.datastore.class_types_select_list ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      this.rowData = this.datastore.class_types_select_list;
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
        this.classTypeSelectListFilter = this.cookieService.get("classTypeSelectListFilter") || "";
        this.gridApi.setQuickFilter(this.classTypeSelectListFilter);
        this.rowData = this.datastore.class_types_select_list;
      } else if (message.text == "redraw_select_lists") {
        this.gridApi.onFilterChanged();
        this.gridApi.redrawRows();
      }
    }
  }

  onSelectionChanged(event) {
    this.datastore.class_type_filter = event.api.getSelectedNodes().map(item => {
      return item.data.name;
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
