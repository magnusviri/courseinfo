import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-class-type-select-list',
  templateUrl: './class-type-select-list.component.html',
  styleUrls: ['./class-type-select-list.component.scss']
})
export class ClassTypeSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public quickFilterName = 'classTypeQuickFilter';
  public cookieFilterName = 'classTypeFilter';
  public datastoreSelectList = 'class_type_select_list';
  public datastoreFilter = 'class_type_filter';
  public columnState = {
    colId: 'name',
    sort: 'asc',
  };
  public someName = 'name';

  constructor(datastore: DatastoreService, cookieService: CookieService) {
    super(datastore, cookieService);
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

  ngOnInit(): void {
  }

}
