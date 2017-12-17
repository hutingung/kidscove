import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { OAuthModule } from 'angular-oauth2-oidc';
import {HttpModule} from "@angular/http";

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './material/app-material.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MembersComponent } from './members/members.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { LoginComponent } from './login/login.component';
import { StoriesComponent } from './stories/stories.component';


import { StoriesAdminService, StoriesAdminSource, StoryDatabase } from './stories/stories-admin.service';
import { MembersAdminService, MembersAdminSource, MemberDatabase } from './dashboard/members-admin.service';
import { HolidayComponent } from './holiday/holiday.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MembersComponent,
    MemberDetailComponent,
    LoginComponent,
    StoriesComponent,
    HolidayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    OAuthModule.forRoot(),
    HttpModule
  ],
  providers: [StoriesAdminService, StoriesAdminSource, StoryDatabase, MembersAdminService, MembersAdminSource, MemberDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }

