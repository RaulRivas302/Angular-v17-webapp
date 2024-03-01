import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { TableComponent } from './pages/table/table.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'table', component: TableComponent ,title: 'table' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
