import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';

import {OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

export class ReactiveComponent implements OnDestroy {
  protected onDestroy$: Subject<any> = new Subject();
  protected takeUntilDestroyed$ = this.onDestroy$.concat(Observable.of(true));

  ngOnDestroy(): void {
    this.onDestroy$.complete();
  }
}
