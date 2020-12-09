// https://stackoverflow.com/questions/46056668/ag-grid-link-with-link-in-the-cell/50695501#50695501
// https://medium.com/ag-grid/enhance-your-angular-grid-reports-with-formatted-values-and-links-34fa57ca2952

import { Component, NgZone } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
    template: '<a [routerLink]="[params.inRouterLink,id]"  (click)="navigate(params.inRouterLink)">{{params.value}}</a>'
})
export class CellRouterLinkComponent implements AgRendererComponent {
    params: any;
    id: number;

    constructor(
        private ngZone: NgZone,
        private router: Router) { }

    agInit(params: any): void {
        this.params = params;
        this.id = params.data['num']*10000+(params.data['yea']-1900)*10+params.data['sem'];
    }

    refresh(params: any): boolean {
        return false;
    }

    // This was needed to make the link work correctly
    navigate(link) {
        this.ngZone.run(() => {
            this.router.navigate([link, this.id]);
        });
    }
}
