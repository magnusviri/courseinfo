import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { BackendResolverService } from './backend/backend-resolver.service';


const routes: Routes = [
  { path:  'course/:courseId', component: DetailComponent, resolve: { items: BackendResolverService } },
  { path: '**',   redirectTo: '/', },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
