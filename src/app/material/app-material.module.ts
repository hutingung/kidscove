import {MdButtonModule, MdCheckboxModule, MdInputModule, MdDatepickerModule, MdNativeDateModule, MdDialogModule, MdTableModule, MdPaginatorModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MdButtonModule, MdCheckboxModule, MdInputModule, BrowserAnimationsModule, MdDatepickerModule, MdNativeDateModule, MdDialogModule, MdTableModule,MdPaginatorModule],
  exports: [MdButtonModule, MdCheckboxModule, MdInputModule, MdDatepickerModule, MdNativeDateModule, MdDialogModule, MdTableModule, CdkTableModule,MdPaginatorModule],
})
export class AppMaterialModule { }