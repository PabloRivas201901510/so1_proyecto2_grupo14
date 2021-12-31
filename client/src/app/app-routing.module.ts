import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentHomeComponent } from './components/component-home/component-home.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: ComponentHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
