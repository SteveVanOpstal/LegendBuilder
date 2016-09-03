import {Injectable} from '@angular/core';

import {Item} from '../item';
import {Samples} from '../samples';

type Trigger<T> = (subject: T) => void;
type Triggers<T> = Array<Trigger<T>>;

export class Observer<T> {
  private subject: T;
  private triggers: Triggers<T> = [];

  subscribe(trigger: Trigger<T>): void {
    this.triggers.push(trigger);
    if (this.subject) {
      trigger(this.subject);
    }
  }

  notify(subject: T): void {
    this.subject = subject;
    if (this.triggers) {
      this.triggers.forEach(trigger => {
        trigger(subject);
      });
    }
  }
}

@Injectable()
export class BuildService {
  samples: Observer<Samples> = new Observer<Samples>();
  pickedItems: Observer<Array<Item>> = new Observer<Array<Item>>();
  stats: Observer<Array<any>> = new Observer<Array<any>>();

  constructor() {}
}
