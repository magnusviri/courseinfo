import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-attr-select-list',
  templateUrl: './attr-select-list.component.html',
  styleUrls: ['./attr-select-list.component.scss']
})
export class AttrSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public quickFilterName = 'attrQuickFilter';
  public datastoreSelectList = 'attr_select_list';
  public datastoreFilter = 'attr_filter';
  public columnState = {
    colId: 'attr',
    sort: 'asc',
  };
  public someName = 'attr';

  constructor(datastore: DatastoreService, cookieService: CookieService) {
    super(datastore, cookieService);
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

  ngOnInit(): void {
  }

}
