import {Component} from '@angular/core'
import {AlfrescoStore} from './alfresco.store'

@Component({
    selector: 'alfresco',
    template: `
            <div class="typeahead-container">
            <input type="hidden" [attr.value]="alfrescoStore.stringify | async">
            <label>Alfresco documenten voor verwerking:</label>
            <drop-off-input></drop-off-input>
            <label>Geselecteerde documenten:</label>
            <alfresco-documents></alfresco-documents>
            </div>
            <label></label>
            `,
    styles: [`.typeahead-container {
                line-height:15px;
                height:300px;
                overflow:hidden; }
            `]
})
export class AppComponent {
  constructor(private alfrescoStore: AlfrescoStore) {}

}
