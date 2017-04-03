import { Component } from '@angular/core'
import {AlfrescoStore} from './alfresco.store'

@Component({
  selector: 'alfresco-documents',
  template: `
            <ul id="alfresco-doc-list" style="list-style: none;">
            <li *ngFor="let document of alfrescoStore.alfrescoDocuments | async; let i = index">
            <button (click)="removeDocument(i)">X</button>
            <label>{{document.name}}</label>
            </li>
            </ul>
            `,
})
export class DocumentComponent {

  constructor(private alfrescoStore: AlfrescoStore) {}

  removeDocument(index : number) {
    this.alfrescoStore.removeDocument(index)
  }
}
