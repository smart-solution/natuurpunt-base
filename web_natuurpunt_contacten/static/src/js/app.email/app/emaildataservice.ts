import { Subject } from "rxjs/Subject"
import { CompleterData, CompleterItem } from "ng2-completer"
import { EmailBackendService } from './emailbackendservice'

export interface IPartner {
    id?: number,
    name?: string,
    email: string,
    value?: string,
}

export class EmailAutocompleteDataService extends Subject<CompleterItem[]> implements CompleterData {
    constructor(private emailBackendService: EmailBackendService) {
        super()
    }

    public search(term: string): void {
      this.emailBackendService
        .searchEmail(term)
        .subscribe(
          (valueArray) => {
              let data = JSON.parse(valueArray[2].responseText).result
              let matches: CompleterItem[] = data.map((result: IPartner) => {
                  return {
                      title: result.name,
                      originalObject: result
                  }
              })
              this.next(matches)
            },
            (e) => {
              console.log(e)
            },
            () => {
              console.log("search complete!!!")
            })
    }

    public cancel() {
        // Handle cancel
    }
}
