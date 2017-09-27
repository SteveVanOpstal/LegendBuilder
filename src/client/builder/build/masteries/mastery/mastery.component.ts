import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'lb-mastery',
  template: `
    <div *ngIf="data"
         [ngClass]="{enabled: enabled, active: active, ranked: data.ranks > 1}"
         (click)="clicked()"
         (contextmenu)="rightClicked()"
         (dragend)="dragEnd()">
      <lb-rank *ngIf="data.ranks > 1 && rank > 0" [rank]="rank" [maxRank]="data.ranks"></lb-rank>
      <img [attr.alt]="data.name" [attr.src]="'mastery/' + data.image.full | lbDDragon">
      <div class="description">
        <h2>{{ data.name }}</h2>
        <p [innerHTML]="description">loading..</p>
      </div>
    </div>`
})

export class MasteryComponent implements OnChanges {
  @Input() data: any;
  @Input() enabled: boolean;

  @Output() rankAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() rankRemoved: EventEmitter<any> = new EventEmitter<any>();

  name: string;
  description: string;

  rank = 0;

  active = false;
  private locked = false;

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
    } else {
      this.active = false;
    }

    if (this.data && this.data.description) {
      if (this.data.description.length === 1) {
        this.description = this.data.description[0];
      } else if (this.rank === 0) {
        this.description = this.createBurns(this.data.description);
      } else if (this.rank <= this.data.description.length) {
        this.description = this.data.description[this.rank - 1];
      } else {
        this.description = this.data.description[this.data.description.length - 1];
      }
    }
  }

  private createBurns(descriptions: Array<string>): string {
    const chops = this.chopAll(descriptions);
    let result = '';
    for (const index of Object.keys(chops[0])) {
      const mergedChops = this.mergeChops(chops, parseInt(index, 10));
      if (this.AllEqual(mergedChops)) {
        result += chops[0][index];
      } else {
        result += this.burn(mergedChops);
      }
    }
    return result;
  }

  private mergeChops(chops: Array<Array<string>>, index: number): Array<string> {
    const result = Array<string>();
    for (const c of chops) {
      result.push(c[index]);
    }
    return result;
  }

  private AllEqual(array: Array<string>): boolean {
    const ref = array[0];
    for (const str of array) {
      if (ref.indexOf(str) < 0) {
        return false;
      }
    }
    return true;
  }

  private burn(array: Array<string>): string {
    return array.join('/');
  }

  private chopAll(descriptions: Array<string>): Array<Array<string>> {
    const result = [];
    for (const description of descriptions) {
      result.push(this.chop(description));
    }
    return result;
  }

  private chop(description: string): Array<string> {
    const result = Array<string>();
    let start = 0;
    let numericSequence = this.isNumeric(description, 0);
    for (let index = 0; index < description.length; index++) {
      const numeric = this.isNumeric(description, index);
      if ((numericSequence && !numeric) || (!numericSequence && numeric)) {
        result.push(description.substr(start, index - start));
        start = index;
        numericSequence = !numericSequence;
      }
    }
    result.push(description.substr(start));
    return result;
  }

  private isNumeric(str: string, index: number): boolean {
    const char = str[index];
    if (char === ' ') {
      return false;
    }
    if (this.isNumber(char)) {
      return true;
    }
    if (char === '.' && (this.isNumber(str[index - 1]) || this.isNumber(str[index + 1]))) {
      return true;
    }
    return false;
  }

  private isNumber(char: string) {
    return !isNaN(Number(char.charAt(0)));
  }
}
