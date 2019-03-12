import { Component, Output, EventEmitter } from '@angular/core'
import { GeopuntBackendService } from './geopuntbackendservice'
import { NodeService } from './nodeservice'
import { OnInit } from '@angular/core'
import { CompleterItem } from 'ng2-completer'
import { Subject } from 'rxjs/Subject'
import { ICapakey } from './nodeservice'

@Component({
  selector: 'capakey-search',
  template: `<input type="hidden" [attr.value]="capakeyObs | async">
             <ng2-completer
                (selected)="onSelected($event)"
                (focus)="onFocus($event)"
                [autofocus]="true"
                [clearSelected]="true"
                [autoMatch]="this.nodeService.getAutoMatch()"
                [datasource]="geopuntBackendService"
                [minSearchLength]="this.nodeService.getSearchLenght()"></ng2-completer>
              <div>
                <capakey-node [node]=this.nodeService.node></capakey-node>
              </div>
              <label><br><br><br>
                <div *ngIf="this.capakey.foundCapakey == true">
                    <b>Capakey gevonden : {{this.capakey.value}}</b>
                </div>
                <div *ngIf="this.capakey.foundCapakey == false">
                    <b>Meerdere capakey mogelijkheden, verfijn verder met {{this.capakey.nextField}}</b>
                </div>
              </label>`,
})
export class CapakeySearchComponent implements OnInit {

  public capakey : ICapakey
  public capakeyObs = new Subject<string>()

  constructor(private geopuntBackendService : GeopuntBackendService,
              private nodeService : NodeService) {
  }

  public onFocus() {}

  public onSelected(selected: CompleterItem) : void {
    if (selected) {
      this.capakey = this.nodeService.addSelectedToNode(selected)
      this.capakeyObs.next(this.capakey.value)
    }
  }

  ngOnInit() {
    this.capakey = {
      foundCapakey:false,
      value:''
    }
  }
}
