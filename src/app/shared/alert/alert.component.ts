import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent  implements OnInit,OnDestroy{


  // @Input() message: string;
  public message: string = "";
  public subscription: Subscription;
  @Output() close = new EventEmitter<void>();

  constructor(private alertService:AlertService){}

  ngOnInit() {
    this.subscription=this.alertService.message.subscribe(message => {
      this.message = message
    })
  }

  // onClose() {
  //   this.close.emit();
  // }
  onClose() {
    this.alertService.closeAlert();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
