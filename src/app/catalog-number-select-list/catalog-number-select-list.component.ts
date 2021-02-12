import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-catalog-number-select-list',
  templateUrl: './catalog-number-select-list.component.html',
  styleUrls: ['./catalog-number-select-list.component.scss']
})
export class CatalogNumberSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public datastoreFilter = 'catalog_number_filter';
  public datastoreSelectList = 'catalog_number_select_list';
  public quickFilterName = 'catalogNumberQuickFilter';
  public selectionChange = 'cat';
  private field = this.selectionChange;
  private headerName = '#';
  public columnState = {
    colId: this.field,
    sort: 'asc',
  };
  constructor(datastore: DatastoreService) {
    super(datastore);
    this.columnDefs = [
      {
        checkboxSelection: true,
        field: this.field,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerName: this.headerName,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
        tooltipField: this.field,
      },
    ];
  }
  ngOnInit(): void {
  }
}
