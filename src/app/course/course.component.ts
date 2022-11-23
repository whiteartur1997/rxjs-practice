import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {concat, fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)

    }

    ngAfterViewInit() {
      const initialLessons$ = this.loadLessons()
      const searchedLessons$ = fromEvent<KeyboardEvent>(this.input.nativeElement, 'keyup')
        .pipe(
          map((event) => (event.target as HTMLInputElement).value),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(search => this.loadLessons(search))
        )

      this.lessons$ = concat(initialLessons$, searchedLessons$)
    }

    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
          map(res => res['payload'])
        )
    }


}
