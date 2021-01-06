import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { JsonApiModule } from 'angular2-jsonapi';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { GridComponent } from './grid/grid.component';

import { AttrSelectListComponent } from './attr-select-list/attr-select-list.component';
import { CatalogNumberSelectListComponent } from './catalog-number-select-list/catalog-number-select-list.component';
import { ComponentSelectListComponent } from './component-select-list/component-select-list.component';
import { CourseDetailLinkComponent } from './course-detail-link/course-detail-link.component';
import { CourseResultsComponent } from './course-results/course-results.component';
import { CourseSelectListComponent } from './course-select-list/course-select-list.component';
import { InstructorSelectListComponent } from './instructor-select-list/instructor-select-list.component';
import { SemesterSelectListComponent } from './semester-select-list/semester-select-list.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,

    FooterComponent,
    HeaderComponent,
    AdminComponent,
    GridComponent,

    AttrSelectListComponent,
    CatalogNumberSelectListComponent,
    ComponentSelectListComponent,
    CourseDetailLinkComponent,
    CourseResultsComponent,
    CourseSelectListComponent,
    InstructorSelectListComponent,
    SemesterSelectListComponent,
  ],
  imports: [
    AgGridModule,
    AngularSplitModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    JsonApiModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
