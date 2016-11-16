import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {Colors} from '../../assets/icon-rank.component';

@Component({
  selector: 'lb-mastery',
  template: `
    <div *ngIf="data"
         [ngClass]="{enabled: enabled, active: active}"
         (click)="clicked()"
         (contextmenu)="rightClicked()"
         (dragend)="dragEnd()">
      <lb-icon-rank [rank]="rank" [maxRank]="data.ranks" [color]="color"></lb-icon-rank>
      <img [attr.alt]="data.name" [lbDDragon]="'mastery/' + data.image.full">
      <div class="description">
        <h2>{{data.name}}</h2>
        <p [innerHTML]="description">loading..</p>
      </div>
    </div>`
})

export class MasteryComponent implements OnChanges {
  @Input() data: any;
  @Input() enabled: boolean;

  @Output() rankAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() rankRemoved: EventEmitter<any> = new EventEmitter<any>();

  private description: string;

  private rank: number = 0;
  private color: string = Colors.gray;

  private active: boolean = false;
  private locked: boolean = false;

  ngOnChanges() {
    this.update();
  }

  enable() {
    if (this.enabled) {
      return;
    }
    if (!this.data) {
      this.disable();
      return;
    }
    this.enabled = true;
    this.update();
  }

  disable() {
    if (!this.enabled || this.rank > 0) {
      return;
    }
    this.enabled = false;
    this.update();
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  getRank() {
    return this.rank;
  }

  addRank() {
    this.rank++;
    this.update();
  }

  setRank(rank: number) {
    if (!this.enabled) {
      return;
    }
    this.rank = rank;
    this.update();
  }

  getMaxRank() {
    if (!this.data || !this.data.ranks) {
      return 0;
    }
    return this.data.ranks;
  }

  rankAdd() {
    if (!this.enabled) {
      return;
    }
    this.rankAdded.emit(this);
    this.update();
  }

  getActive() {
    return this.active;
  }

  getColor() {
    return this.color;
  }

  rankRemove() {
    if (!this.enabled || this.locked) {
      return;
    }
    if (this.rank > 0) {
      this.rank--;
    }
    this.rankRemoved.emit(this);
    this.update();
  }

  clicked() {
    this.rankAdd();
  }

  dragEnd() {
    this.rankAdd();
  }

  rightClicked() {
    this.rankRemove();
    return false;  // stop context menu from appearing
  }

  private update() {
    if (this.enabled) {
      this.active = this.rank !== 0;
      this.color = this.active ? Colors.yellow : Colors.blue;
    } else {
      this.active = false;
      this.color = Colors.gray;
    }

    if (this.data && this.data.description) {
      if (this.data.description.length === 1) {
        this.description = this.data.description[0];
      } else if (this.rank === 0) {
        let description = '';
        for (let i in this.data.description) {
          description += 'Mastery level ' + (parseInt(i, 10) + 1) + ':<br>';
          description += this.data.description[i];
          description += '<br><br>';
        }
        this.description = description;
      } else if (this.rank <= this.data.description.length) {
        this.description = this.data.description[this.rank - 1];
      } else {
        this.description = this.data.description[this.data.description.length - 1];
      }
    }
  }
}
