import {MdButtonModule, MdCheckboxModule, MdInputModule, MdDatepickerModule, MdNativeDateModule, MdDialogModule} from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MdButtonModule, MdCheckboxModule, MdInputModule, BrowserAnimationsModule, MdDatepickerModule, MdNativeDateModule, MdDialogModule],
  exports: [MdButtonModule, MdCheckboxModule, MdInputModule, MdDatepickerModule, MdNativeDateModule, MdDialogModule],
})
export class AppMaterialModule { }