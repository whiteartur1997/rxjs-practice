import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO

export const setRxjsLoggingLevel = (level: RxJsLoggingLevel) => {
  rxjsLoggingLevel = level
}

export const debug = (level: RxJsLoggingLevel, message: string) => (source: Observable<any>) => {
  return source.pipe(
    tap(val => {
      if(level >= rxjsLoggingLevel) {
        console.log(message + ": ", val);
      }
    })
  )
}
