import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { Subscription } from 'rxjs';

@Component({template: ''})
export class SelectListComponent implements OnInit, OnDestroy {
  // Overrides
  public quickFilterName;
  public datastoreSelectList;
  public datastoreFilter;
  public columnState;
  public someName;

  // Used in template
  public quickFilter = ''; // Input field vaule
  public columnDefs;
  public defaultColDef;
  public postSort;
  public rowClassRules;
  public rowData: any[];
  public rowSelection;

  private gridApi;
  private gridColumnApi;
  private datastoreMessages: Subscription;
  private datastore;
  private cookieService;

  constructor(datastore: DatastoreService,  cookieService: CookieService) {
    this.datastore = datastore;
    this.cookieService = cookieService;
  }

  onQuickFilterChanged() {
    let value = (<HTMLInputElement>document.getElementById(this.quickFilterName)).value;
    this.cookieService.put(this.quickFilterName, value);
    this.gridApi.setQuickFilter(value);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.applyColumnState({
      state: [ this.columnState ],
      defaultState: { sort: null },
    });
    if ( ! this.datastore.select_lists[this.datastoreSelectList] ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      this.rowData = this.datastore.select_lists[this.datastoreSelectList];
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
        this.quickFilter = this.cookieService.get(this.quickFilterName) || "";
        this.gridApi.setQuickFilter(this.quickFilter);
        this.rowData = this.datastore.select_lists[this.datastoreSelectList];
      } else if (message.text == "clear_filters") {
        (<HTMLInputElement>document.getElementById(this.quickFilterName)).value = '';
        this.gridApi.setQuickFilter('');
        this.gridApi.deselectAll();
        this.cookieService.put(this.quickFilterName, '');
      } else if (message.text == "redraw_select_lists") {
        this.gridApi.onFilterChanged();
        this.gridApi.redrawRows();
      }
    }
  }

  onSelectionChanged(event) {
    this.datastore.selectListFilterChanged(
      this.datastoreFilter,
      event.api.getSelectedNodes().map(item => {
        return item.data[this.someName];
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }
}
