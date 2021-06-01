import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarProfilePageRoutingModule } from './editar-profile-routing.module';

import { EditarProfilePage } from './editar-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarProfilePageRoutingModule
  ],
  declarations: [EditarProfilePage]
})
export class EditarProfilePageModule {}
