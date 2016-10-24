import {Injectable} from '@angular/core';

import {Item} from '../build/item';
import {Samples} from '../build/samples';

type Trigger<T> = (subject: T) => void;
type Triggers<T> = Array<Trigger<T>>;

export class Observer<T> {
  public subject: T;
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
      for (let trigger of this.triggers) {
        trigger(subject);
      }
    }
  }
}

@Injectable()
export class DataService {
  samples: Observer<Samples> = new Observer<Samples>();
  pickedItems: Observer<Array<Item>> = new Observer<Array<Item>>();
  stats: Observer<Array<any>> = new Observer<Array<any>>();
  champion: Observer<any> = new Observer<any>();

  constructor() {}
}
