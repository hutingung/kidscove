import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Member }        from '../member';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

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
  result: string;
  expired: Boolean;
  constructor(db: AngularFireDatabase) { 
    this.db = db
    this.expired = false;
  }
  ngOnInit() {
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
        this.result = "Result Not Found";
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
  
  checkout(): void {
    if(this.member) {
        this.member.update({status: "out", lastOutDate: new Date()});
    }
  }
  create(): void {
    if(this.member) {
        this.member.set({id: this.id, status: "out", expiredDate: new Date()});
    }
  }
}