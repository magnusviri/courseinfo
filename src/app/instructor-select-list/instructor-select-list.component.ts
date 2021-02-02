import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie';
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
  public rowClassRules;
  public postSort;
  public instructorSelectListFilter = "";

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
    let value = (<HTMLInputElement>document.getElementById('instructorSelectListFilter')).value;
    this.gridApi.setQuickFilter(value);
    this.cookieService.put("instructorSelectListFilter", value);
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
      this.datastoreMessages = this.datastore.onMessage().subscribe(
        message => {this.onMessage(message)}
      );
    } else {
      this.rowData = this.datastore.instructors_select_list;
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
        this.instructorSelectListFilter = this.cookieService.get("instructorSelectListFilter") || "";
        this.gridApi.setQuickFilter(this.instructorSelectListFilter);
        this.rowData = this.datastore.instructors_select_list;
      } else if (message.text == "redraw_select_lists") {
        this.gridApi.onFilterChanged();
        this.gridApi.redrawRows();
      }
    }
  }

  onSelectionChanged(event) {
    this.datastore.instructor_filter = event.api.getSelectedNodes().map(item => {
      return item.data.unid;
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
