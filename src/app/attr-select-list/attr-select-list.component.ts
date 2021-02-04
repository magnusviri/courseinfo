import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
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
  public rowClassRules;
  public postSort;
  public attrSelectListFilter = "";

  columnDefs;
  defaultColDef;
  rowSelection;
  suppressRowClickSelection;
  rowData: any[];
  private datastoreMessages: Subscription;

  constructor(private datastore: DatastoreService, private cookieService: CookieService) {
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
    let value = (<HTMLInputElement>document.getElementById('attrSelectListFilter')).value;
    this.gridApi.setQuickFilter(value);
    this.cookieService.put("attrSelectListFilter", value);
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
    if ( ! this.datastore.attrs_select_list ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      this.rowData = this.datastore.attrs_select_list;
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
        this.attrSelectListFilter = this.cookieService.get("attrSelectListFilter") || "";
        this.gridApi.setQuickFilter(this.attrSelectListFilter);
        this.rowData = this.datastore.attrs_select_list;
      } else if (message.text == "redraw_select_lists") {
        this.gridApi.onFilterChanged();
        this.gridApi.redrawRows();
      }
    }
  }

  onSelectionChanged(event) {
    this.datastore.attr_filter = event.api.getSelectedNodes().map(item => {
      return item.data.attr;
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
