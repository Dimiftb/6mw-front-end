import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimerPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timer',
})
export class TimerPipe implements PipeTransform {

  transform(value: number): string {
    if(value === null) {
      value = 360;
    }
    const minutes: number = (Math.floor(value/60));
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value-minutes * 60)).slice(-2);
  }
}
