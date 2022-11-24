import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {startWith} from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  sub: Subscription
  constructor() { }

  ngOnInit() {
    const int$ = interval(1000).pipe(
      startWith(3)
    )

    this.sub = int$.subscribe(console.log)
    // const http$ = createHttpObservable('/api/courses')
    // const sub = http$.subscribe(console.log)
    //
    // setTimeout(() => sub.unsubscribe(), 50)
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
