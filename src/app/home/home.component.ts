import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable, timer} from 'rxjs';
import {delayWhen, map, retryWhen, shareReplay} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCoursers$: Observable<Course[]>

    constructor() {

    }

    ngOnInit() {
      const http$ = createHttpObservable('api/courses')

      const courses$: Observable<Course[]> = http$.pipe(
        // one option is to error out errored out observable
        // catchError(err => {
        //   console.log("Error occurred ", err)
        //   return throwError(err)
        // }),
        // finalize(() => {
        //   console.log("Finalize done...")
        // }),
        map(res => Object.values(res['payload'])),
        shareReplay<Course[]>(),
        //another option is to retry again
        retryWhen(errors => errors.pipe(
          delayWhen(() => timer(2000))
        ))
      )

      this.beginnerCourses$ = courses$
        .pipe(
          map(courses => courses.filter(course => course.category === "BEGINNER")),
        )

      this.advancedCoursers$ = courses$
        .pipe(
          map(courses => courses.filter(course => course.category === 'ADVANCED'))
        )
    }

}
