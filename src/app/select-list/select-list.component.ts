import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({template: ''})
export class SelectListComponent implements OnInit, OnDestroy {
  // Override in subclasses
  public columnState;
  public datastoreFilter;
  public datastoreSelectList;
  public defaultSelection;
  public quickFilterName;
  public selectionChange;

  // Used in template (must be public)
  public quickFilter = ''; // Input field vaule

  // ag-grid properties
  public columnDefs;
  public defaultColDef;
  public rowClassRules;
  public rowData: any[];
  public rowSelection;
  private gridApi;
  private gridColumnApi;

  // my properties
  private datastoreMessages: Subscription;
  private datastore;
  private redrawRows: Subject<any> = new Subject();

  constructor(datastore: DatastoreService) {
    this.datastore = datastore;
    this.defaultColDef = {
      flex: 1,
    };
    this.rowSelection = 'multiple';
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
      state: [ this.columnState ],
      defaultState: { sort: null },
    });
    this.rowClassRules = {
      "select-list-inactive-element": function (params) {
        return !params.data.active;
      },
    };
    if ( ! this.datastore.select_lists[this.datastoreSelectList] ) {
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      console.log("This branch never happens!");
      // this.rowData = this.datastore.select_lists[this.datastoreSelectList];
      // this.gridApi.onFilterChanged();
    }

    this.redrawRows
      .pipe(debounceTime(100))
      .subscribe(() => {
        // This is a time intensive process. Delay this and get rid of duplicate calls by debouncing it.
        // redrawRows is required to get the cells to change the style to grey
        // console.log("redrawRows");
        this.gridApi.redrawRows() // https://www.ag-grid.com/documentation/angular/view-refresh/
      });
  }

  // Row selection is changed (template event binding). Use the grid API to get the new row selected.
  // This is the start of a long drawn out process to redraw everything
  onSelectionChanged(event) {
    let data = event.api.getSelectedNodes().map(item => {
      return item.data[this.selectionChange];
    });
    if (this.datastore.select_list_filter[this.datastoreFilter]) {
      let old_count = this.datastore.select_list_filter[this.datastoreFilter].length;
      if ( data.length != old_count ) {
        this.datastore.selectListFilterChanged(this.datastoreFilter, data);
        this.datastore.setPrefObj(this.datastoreFilter, data);
      }
    } else {
      this.datastore.selectListFilterChanged(this.datastoreFilter, data);
      this.datastore.setPrefObj(this.datastoreFilter, data);
    }
  }

  // Perform some post-sorting if you require additional control over the sorted rows.
  // https://www.ag-grid.com/documentation/javascript/row-sorting/
  onPostSort(rowNodes) {
    var toIndex = 0;
    for (var ii = 0; ii < rowNodes.length; ii++) {
      if (rowNodes[ii].data.active) {
        rowNodes.splice(toIndex, 0, rowNodes.splice(ii, 1)[0]);
        toIndex++;
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // datastoreMessages subscription methods

  onMessage(message) {
    if (message) {
      if (message.text == "courses_loaded") {
        this.coursesLoaded();
      } else if (message.text == "clear_filters") {
        this.clearFilters();
      } else if (message.text == "redraw_select_lists_start") {
        this.gridApi.forEachNode(this.setSelectedFactoryFunction());
        this.redrawSelectLists();
      } else if (message.text == "redraw_select_lists") {
        this.redrawSelectLists();
      }
    }
  }

  // Called by onMessage
  // Message is sent by datastore in loadData when JSON data is loaded from the
  // server and parsed and ready to display
  coursesLoaded() {
    this.quickFilter = this.datastore.getPref(this.quickFilterName);
    this.gridApi.setQuickFilter(this.quickFilter);
    this.rowData = this.datastore.select_lists[this.datastoreSelectList];
  }

  // Called by onMessage
  // Message is sent by datastore in clearAllFilters, which is trigged by the
  // Welcome component when the user clicks on a button
  clearFilters() {
    let currentQuickFilter = (<HTMLInputElement>document.getElementById(this.quickFilterName)).value;
    if (currentQuickFilter) {
      (<HTMLInputElement>document.getElementById(this.quickFilterName)).value = '';
      this.gridApi.setQuickFilter('');
      this.datastore.setPref(this.quickFilterName, null);
    }
    this.gridApi.deselectAll();
    this.datastore.setPrefObj(this.datastoreFilter, null);
    if (this.defaultSelection) {
      this.gridApi.forEachNode(this.setSelectedFactoryFunction());
    }
  }

  // called by clearFilters
  setSelectedFactoryFunction() {
    // e.g. defaultSelection = {'state':true, 'list':{'Discussion': false}};
    let fieldName = this.selectionChange;
    let savedFilters = this.datastore.getPrefObj(this.datastoreFilter);
    let defaultSelection = this.defaultSelection;
    if (savedFilters && savedFilters.length > 0 || defaultSelection ) {
      return function (node) {
        if (savedFilters) {
          if (savedFilters.length > 0) {
            node.setSelected(savedFilters.indexOf(node.data[fieldName]) >= 0);
          }
        } else if (defaultSelection) {
          // Cookie doesn't exist, go to default
          if (node.data[fieldName] in defaultSelection['list']) {
        //     node.setSelected(savedFilters.indexOf(node.data[fieldName]) >= 0);
          } else {
            node.setSelected(defaultSelection.default);
          }
        }
      }
    } else {
      return function (node) {}
    }
  }

  // Called by onMessage
  // Message is sent by filterHasChanged and setAllSelectListFilterItemsToActive
  // It is being called too many times, bug here...
  redrawSelectLists() {
    this.gridApi.onFilterChanged(); // https://www.ag-grid.com/documentation/angular/filter-api/
    this.redrawRows.next();
  }

  //////////////////////////////////////////////////////////////////////////////////////////

  // quick filter input event binding
  onQuickFilterChanged() {
    let value = (<HTMLInputElement>document.getElementById(this.quickFilterName)).value;
    this.datastore.setPref(this.quickFilterName, value);
    this.gridApi.setQuickFilter(value); // https://www.ag-grid.com/documentation/angular/filter-quick/
  }

  //////////////////////////////////////////////////////////////////////////////////////////

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.datastoreMessages && !this.datastoreMessages.closed) {
      this.datastoreMessages.unsubscribe();
    }
  }
}
