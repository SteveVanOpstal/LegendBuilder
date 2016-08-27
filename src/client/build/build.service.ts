import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {Item} from './item';

type Trigger<T> = (subject: T) => void;
type Triggers<T> = Array<Trigger<T>>;

class Notifier<T> {
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
  pickedItems: Notifier<Array<Item>> = new Notifier<Array<Item>>();

  constructor() {}
}
