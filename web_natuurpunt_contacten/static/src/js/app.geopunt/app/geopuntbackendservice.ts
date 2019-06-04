import {Injectable} from '@angular/core'
import {Inject} from '@angular/core'
import {Observable} from "rxjs/Observable"
import { Subject } from "rxjs/Subject"
import { CompleterData, CompleterItem } from "ng2-completer"
import { NodeService } from './nodeservice'
import { Http, Response } from '@angular/http'

interface Municipality {
  municipalityCode: number
  municipalityName: string
}

interface Department {
  departmentCode: number
  departmentName: string
}

interface Section {
  sectionCode: string
}

interface Parcel {
  perceelnummer: string
  capakey: string
}

interface Result {
  succes: boolean
  startTimeStamp: string
  endTimeStamp: string
  elapsed: number
}

interface Municipalities {
  municipalities: Array<Municipality>
  result: Result
}

interface Departments {
  departments: Array<Department>
  result: Result
}

interface Sections {
  sections: Array<Section>
  result: Result
}

interface Parcels {
  parcels: Array<Parcel>
  result: Result
}

@Injectable()
export class GeopuntBackendService extends Subject<CompleterItem[]> implements CompleterData {

  private api: string = "http://geoservices.informatievlaanderen.be/capakey/api/v1"

  private getMunicipality(path): Observable<Municipalities> {
    return this.http.get(this.api + path)
                    .map(response => response.json())
  }

  private getDepartment(path): Observable<Departments> {
    return this.http.get(this.api + path)
                    .map(response => response.json())
  }

  private getSection(path): Observable<Sections> {
    return this.http.get(this.api + path)
                    .map(response => response.json())
  }

  private getParcel(path): Observable<Parcels> {
    return this.http.get(this.api + path)
                    .map(response => response.json())
  }

  public search(term: string): void {
    switch(this.nodeService.getNodeName()) {
       case "Gemeente": {
        let path = "/Municipality/"
        this.getMunicipality(path).subscribe(
         (res) => {
           let data = res.municipalities.filter(m => m.municipalityName.startsWith(term))
           let matches: CompleterItem[] = data.map((data) => ({
             title:data.municipalityName,
             originalObject: path + data.municipalityCode}))
           this.next(matches)
         },
         (e) => {
           console.log(e)
         },
         () => {
           console.log("search Municipality complete!!!")
        })
        break
       }
       case "Afdeling": {
         let path = this.nodeService.getPath() + "/department/"
         this.getDepartment(path).subscribe(
          (res) => {
            let data = res.departments.map(d => ({
              'departmentName': d.departmentName.substr(d.departmentName.indexOf(' ')+1),
              'departmentCode': d.departmentCode
            })).filter(d => d.departmentName.startsWith(term))
            let matches: CompleterItem[] = data.map((data) => ({
              title:data.departmentName,
              originalObject:path + data.departmentCode}))
            this.next(matches)
          },
          (e) => {
            console.log(e)
          },
          () => {
            console.log("search department complete!!!")
         })
         break
       }
       case "Sectie": {
         let path = this.nodeService.getPath() + "/section/"
         this.getSection(path).subscribe(
          (res) => {
            let data = res.sections.filter(s => s.sectionCode.startsWith(term))
            let matches: CompleterItem[] = data.map((data) => ({
              title:data.sectionCode,
              originalObject:path + data.sectionCode}))
            this.next(matches)
          },
          (e) => {
            console.log(e)
          },
          () => {
            console.log("search section complete!!!")
         })
         break
       }
       case "Perceel": {
         let path = this.nodeService.getPath() + "/parcel/"
         this.getParcel(path).subscribe(
          (res) => {
            let data = res.parcels.filter(p => p.perceelnummer.startsWith(term))
            let matches: CompleterItem[] = data.map((data) => ({
              title:data.perceelnummer,
              originalObject:data}))
            this.next(matches)
          },
          (e) => {
            console.log(e)
          },
          () => {
            console.log("search parcel complete!!!")
         })
         break
       }
       default: {
          console.log("Invalid choice");
          break;
       }
    }

  }

  public cancel() {
    // Handle cancel
  }

  constructor(private nodeService : NodeService, private http: Http) {
    super()
  }

}
