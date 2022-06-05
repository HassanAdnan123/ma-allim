import { NgModule } from '@angular/core';
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
  declarations: [PeriodsPage]
})
export class PeriodsPageModule {}
