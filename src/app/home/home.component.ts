import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map, shareReplay} from 'rxjs/operators';
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
        catchError(err => {
          console.log("Error occurred ", err)
          return throwError(err)
        }),
        map(res => Object.values(res['payload'])),
        shareReplay<Course[]>(),
        finalize(() => {
          console.log("Finalize done...")
        })
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
