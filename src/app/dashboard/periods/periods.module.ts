import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeriodsPageRoutingModule } from './periods-routing.module';

import { PeriodsPage } from './periods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeriodsPageRoutingModule
  ],
  declarations: [PeriodsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PeriodsPageModule {}
