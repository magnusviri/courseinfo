import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-catalog-number-select-list',
  templateUrl: './catalog-number-select-list.component.html',
  styleUrls: ['./catalog-number-select-list.component.scss']
})
export class CatalogNumberSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public quickFilterName = 'catalogNumberQuickFilter';
  public datastoreSelectList = 'catalog_number_select_list';
  public datastoreFilter = 'catalog_number_filter';
  public columnState = {
    colId: 'cat',
    sort: 'asc',
  };
  public someName = 'cat';

  constructor(datastore: DatastoreService, cookieService: CookieService) {
    super(datastore, cookieService);
    this.columnDefs = [
      {
        field: 'cat',
        headerName: '#',
        tooltipField: 'cat',
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
