import { Component, OnInit, ViewChild, ElementRef, Inject, Injectable  } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import { Http, Response } from '@angular/http';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { MdPaginator } from '@angular/material';
import { MembersAdminService, MembersAdminSource, MemberDatabase } from './members-admin.service';
import { Member }        from './member';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('inputId') inputId:ElementRef; 
  member: FirebaseObjectObservable<any>;
  id: number;
  db: AngularFireDatabase;
  message: string;
  expired: Boolean;
  
  memberTypes = [
    {value: 'none', viewValue: 'Per Entry'},
    {value: 'monthly', viewValue: 'Monthly'},
    {value: 'yearly', viewValue: 'Yearly'}
  ];
  
  //table
  membersData: Member[];
  private result: boolean;
  allMembers: Member[];
  // For search
  startAt = new Subject();
  endAt = new Subject();
  lastKeypress: 0;
    // For MD data table.
  private dataSource: MembersAdminSource | null;
  private displayedColumns = [
      'id',
      'name',
      'checkout'
  ];

  @ViewChild(MdPaginator)
  paginator: MdPaginator;

  public dataLength: any; // For member counter on DOM.
  
  constructor(private membersAdminService: MembersAdminService, private memberDatabase: MemberDatabase, db: AngularFireDatabase, private http: Http) { 
    this.db = db
    this.expired = false;
  }
  ngOnInit() { 
    this.memberDatabase.getMembers()
        .subscribe(members => {
            this.dataSource = new MembersAdminSource(this.memberDatabase, this.paginator);
            this.dataLength = members;
    });
  }
  
  loadData(member: Member): void {
        const url ='https://quickbooks.api.intuit.com/v3/company/123145862902554/query?query=select%20%2A%20from%20Customer%20Where%20Metadata.CreateTime%20%3E%20%272017-08-15%27&minorversion=4';
    this.http
    .get(url)
    .toPromise()
    .then(() => member);

  }
  
  load(id: number): void {
     if(id) {
        this.member = this.db.object('/membership/members/' + id);
        this.member.subscribe((member)=>{
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            this.expired = yesterday.getTime() > new Date(member.expiredDate).getTime();
        });
     } else {
        this.message = "Result Not Found";
     }
  }
  
  reset() : void {
    this.id = null;
    this.member = null;
    this.inputId.nativeElement.focus();
  }
  
  checkin(): void {
    if(this.member) {
        this.member.update({status: "in", lastInDate: new Date()});
    }
  }
  
  checkout(member): void {
    if(member) {
        var checkoutmember = this.db.object('/membership/members/' + member.id);
        checkoutmember.update({status: "out", lastOutDate: new Date()});
    } else if(this.member) {
        this.member.update({status: "out", lastOutDate: new Date()});
    }
  }
  create(): void {
    if(this.member) {
        this.member.set({id: this.id, status: "out", expiredDate: new Date()});
    }
  }
}