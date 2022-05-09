import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public message = new BehaviorSubject<string>(null);

  closeAlert() {
    this.message.next(null);
  }

  setMessage(message:string) {
    this.message.next(message);
  }
}
