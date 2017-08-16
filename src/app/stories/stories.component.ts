import { Component, OnInit, ViewChild, ElementRef, Inject, Injectable  } from '@angular/core';
import {Subject} from 'rxjs/Subject';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { MdPaginator } from '@angular/material';
import { StoriesAdminService, StoriesAdminSource, StoryDatabase } from './stories-admin.service';
import { Story }        from './story';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

  @ViewChild('inputId') inputId:ElementRef; 
  @ViewChild('inputTotal') inputTotal:ElementRef; 
  id: Number;
  storyId: Number;
  full: Boolean;
  db: AngularFireDatabase;
  story: FirebaseObjectObservable<any>;
  keys: FirebaseObjectObservable<any>;
  participants: FirebaseListObservable<any[]>;
  storiesData: Story[];
  private result: boolean;
  allStories: Story[];
  // For search
  startAt = new Subject();
  endAt = new Subject();
  lastKeypress: 0;
    // For MD data table.
  private dataSource: StoriesAdminSource | null;
  private displayedColumns = [
      'id',
      'description',
      'datetime',
      'total',
      'edit'
  ];

  @ViewChild(MdPaginator)
  paginator: MdPaginator;

  public dataLength: any; // For member counter on DOM.

  constructor(private storiesAdminService: StoriesAdminService, private storyDatabase: StoryDatabase, db: AngularFireDatabase) {
    this.db = db;
    this.full = false;
  }

  ngOnInit() {
    this.storyDatabase.getStories()
        .subscribe(stories => {
            this.dataSource = new StoriesAdminSource(this.storyDatabase, this.paginator);
            this.dataLength = stories;
    });
    this.keys = this.db.object('/membership/keys/');
        
  }
  
  edit(story) : void {
    this.story = this.db.object('/membership/stories/' + story.id);
    this.participants = this.db.list('/membership/stories/' + story.id + '/participants/');
    this.participants.subscribe((participants)=>{
        if(participants.length >= 15) {
            this.full = true;
        }
        this.story.update({total: participants.length});
    });
    this.storyId = story.id;
  }
  
  delete(story) : void {
    //this.story = this.db.object('/membership/stories/' + story.id);
    //this.story.remove();
  }
  
  reset() : void {
    this.story = null;
    this.full = false;
    this.participants = null;
  }
  
  
  create(): void {
    if(this.inputId.nativeElement.value) {
        this.story = this.db.object('/membership/stories/' + this.inputId.nativeElement.value);
        this.story.set({id: this.inputId.nativeElement.value});
        this.keys.update({stories: parseInt(this.inputId.nativeElement.value) + 1});
    }
  }
  deleteParticipant(participant): void {
    this.db.object('/membership/stories/' + this.storyId + '/participants/' + participant.id).remove();
  }
  addParticipant(id): void {
    var participant = this.db.object('/membership/members/' + id);
    participant.subscribe((participant)=>{
        if(participant.id) {
            var newParticipant = this.db.object('/membership/stories/' + this.storyId + '/participants/' + participant.id);
            newParticipant.set({"name": participant.name, "id": participant.id});
        }
    });
  }
}