import { Component } from '@angular/core'
import { Http } from "@angular/http"
import { CompleterItem } from 'ng2-completer'
import { EmailAutocompleteDataService } from './emaildataservice'
import { IPartner } from './emaildataservice'
import { EmailBackendService } from './emailbackendservice'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'email',
  template: `<input type="hidden" [attr.value]="stringify | async">
             <ng2-completer
                           (selected)="onEmailSelected($event)"
                           [datasource]="dataService"
                           [minSearchLength]="3"
                           [clearSelected]="true"
                           [overrideSuggested]="true"></ng2-completer>
             <div *ngFor="let item of selected">
              <div class="selected">
                  <span>{{item.value}}</span>
                  <a (click)="remove(item)"><font color="blue">x</font></a>
              </div>
            </div>
            `,
  styles: [`
    .selected{
    	border:solid #4CAF50 1px;
    	float:left;
    	margin:2px;
    	padding:2px 15px;
    }
    .completer-input {
      width: 50%
    }
    .completer-dropdown {
        width: 680px !important;
    }
    .selected a{
    	cursor:pointer;
    	font-weight:bold;}
    `]
})
export class AppComponent {
  constructor(private emailBackendService: EmailBackendService)
  {
    this.dataService = new EmailAutocompleteDataService(emailBackendService)
  }

  protected dataService: EmailAutocompleteDataService
  public selected : IPartner[] = []
  public stringify = new Subject<string>()

  private validateEmail(emailAddress: string) {
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
      if(emailAddress.match(mailformat))
        return true
      else
        return false
  }

  private isBlank(selected: string) {
    return /^\s*$/.test(selected)
  }

  private pushSelected(partner: IPartner) {
    this.selected.push(partner)
    this.stringify.next(JSON.stringify(this.selected))
  }

  public onEmailSelected(selected: CompleterItem) {
      if (selected && !this.isBlank(selected.title)) {
        // selected from openerp database?
        if (selected.originalObject && selected.originalObject.email) {
          let partner : IPartner = {
              id : selected.originalObject.id,
              email : selected.originalObject.email,
              name : selected.originalObject.name,
              value : selected.title.replace(/\[.*\]/,"").trim() // remove id for readabilty
          }
          this.pushSelected(partner)
        }
        else {
          let value = selected.title.trim()
          if( this.validateEmail(value) ) {
            let partner : IPartner = {
                email : value,
                value : value
              }
            this.pushSelected(partner)
            }
          else
            alert("You have entered an invalid email address!")
        }
      }
  }

  public remove(item) {
    this.selected.splice(this.selected.indexOf(item),1)
    this.stringify.next(JSON.stringify(this.selected))
  }
}
