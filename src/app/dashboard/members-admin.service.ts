import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { Inject, Injectable } from '@angular/core';
import { Member }        from './member';
// Data Table imports.
import { MdPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';

@Injectable()
export class MembersAdminService {

  private membersData$: FirebaseListObservable<Member[]>;

  constructor(
    public af: AngularFireDatabase,

    // For Create and Update functions.
    @Inject(FirebaseApp) fb) {
      this.membersData$ = af.list('/membership/members/');
    }
}

@Injectable()
export class MemberDatabase {

    /* Stream that emits whenever the data has been modified. */
    public dataChange: BehaviorSubject<Member[]> = new BehaviorSubject<Member[]>([]);
    get data(): Member[] {
        return this.dataChange.value; }

    // Connection to remote db.
    private database = this.membersAdminService.af.list('/membership/members/', {
        query: {
            orderByChild: 'status',
            equalTo: 'in' 
        }
    });
    public getMembers(): FirebaseListObservable<Member[]> {
        return this.database;
    }

    constructor(private membersAdminService: MembersAdminService) {
        this.getMembers()
            .subscribe(data => this.dataChange.next(data));
    }
}

@Injectable()
export class MembersAdminSource extends DataSource<Member> {


    constructor(
        private memberDatabase: MemberDatabase,
        private paginator: MdPaginator) {
        super();
    }


    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Member[]> {

      const displayDataChanges = [
          this.memberDatabase.dataChange,
          this.paginator.page,
      ];

      return Observable
          .merge(...displayDataChanges) // Convert object to array with spread syntax.
          .map(() => {
              const dataSlice = this.memberDatabase.data.slice(); // Data removed from viewed page.

              // Get the page's slice per pageSize setting.
              const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

              const dataLength = this.paginator.length;  // This is for the counter on the DOM.

              return dataSlice.splice(startIndex, this.paginator.pageSize);
          });
    }
    disconnect() {}
}
