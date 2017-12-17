import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import { Http, Response } from '@angular/http';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class HolidayComponent implements OnInit {

  private membersData$: FirebaseListObservable<any[]>;
  
  db: AngularFireDatabase;

  constructor(db: AngularFireDatabase) { 
    this.db = db;
  }

  ngOnInit() {
  }
  
  incrementAudit(memberId){
    let newAuditId = 0;
    this.db.object(`/membership/members/${memberId}/audit/id`).$ref
    .ref.transaction(id => {
        if (id === null) {
            newAuditId = 1;
            return id = 1;
        } else {
            newAuditId = id + 1;
            return id + 1;
        }
    })
    return newAuditId;
}
  
  updateExpired(days: number, membersData) : void{  
    for (let entry of membersData) {
        let member = this.db.object('/membership/members/' + entry.id);
        let newAuditId = this.incrementAudit(entry.id);
        let updateHistory = this.db.object('/membership/members/' + entry.id + '/audit/' + newAuditId);
        let expiredDate = new Date(entry.expiredDate);
        let newExpiredDate = new Date(expiredDate);
        newExpiredDate.setDate(expiredDate.getDate() + days);
        member.update({expiredDate: newExpiredDate});
        updateHistory.set({"field":"expiredDate", "from": expiredDate.getTime(), "to": newExpiredDate.getTime()});
    }
  }
  
  update(days: number) : void {
   if(days == null) {
    return;
   }
   
   let subscription = this.db.list('/membership/members/', {
        query: {
            orderByChild: 'memberType',
            equalTo: 'monthly'
        }
    }).subscribe((membersData)=>{
        this.updateExpired(days, membersData);
        subscription.unsubscribe();
   });
   
   let subscription2 = this.db.list('/membership/members/', {
        query: {
            orderByChild: 'memberType',
            equalTo: 'yearly'
        }
    }).subscribe((membersData)=>{
        this.updateExpired(days, membersData);
        subscription2.unsubscribe();
   });
  }

}
