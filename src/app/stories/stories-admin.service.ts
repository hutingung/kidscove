import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { Inject, Injectable } from '@angular/core';
import { Story }        from './story';
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
export class StoriesAdminService {

  private storiesData$: FirebaseListObservable<Story[]>;

  constructor(
    public af: AngularFireDatabase,

    // For Create and Update functions.
    @Inject(FirebaseApp) fb) {
      this.storiesData$ = af.list('/membership/stories/');
    }
}

@Injectable()
export class StoryDatabase {

    /* Stream that emits whenever the data has been modified. */
    public dataChange: BehaviorSubject<Story[]> = new BehaviorSubject<Story[]>([]);
    get data(): Story[] {
        return this.dataChange.value; }

    // Connection to remote db.
    private database = this.storiesAdminService.af.list('/membership/stories/', {
        query: {
            orderByChild: 'datetimestamp',
            startAt: {key: 'datetimestamp', value: new Date().getTime() - 8.64e+7}
        }
    });
    public getStories(): FirebaseListObservable<Story[]> {
        return this.database;
    }

    constructor(private storiesAdminService: StoriesAdminService) {
        this.getStories()
            .subscribe(data => this.dataChange.next(data));
    }
}

@Injectable()
export class StoriesAdminSource extends DataSource<Story> {


    constructor(
        private storyDatabase: StoryDatabase,
        private paginator: MdPaginator) {
        super();
    }


    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Story[]> {

      const displayDataChanges = [
          this.storyDatabase.dataChange,
          this.paginator.page,
      ];

      return Observable
          .merge(...displayDataChanges) // Convert object to array with spread syntax.
          .map(() => {
              const dataSlice = this.storyDatabase.data.slice(); // Data removed from viewed page.

              // Get the page's slice per pageSize setting.
              const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

              const dataLength = this.paginator.length;  // This is for the counter on the DOM.

              return dataSlice.splice(startIndex, this.paginator.pageSize);
          });
    }
    disconnect() {}
}
