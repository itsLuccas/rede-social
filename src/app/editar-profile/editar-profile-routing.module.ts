import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarProfilePage } from './editar-profile.page';

const routes: Routes = [
  {
    path: '',
    component: EditarProfilePage
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarProfilePageRoutingModule {}
