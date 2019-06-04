import {Injectable} from '@angular/core'
import { CompleterItem } from 'ng2-completer'

export interface INode {
    name: string,
    value: string,
    path?: string,
    children: INode[],
}

export interface IQuery {
    name: string,
    searchLenght?: number,
    level?: number,
    autoMatch?: boolean,
    children: IQuery[],
}

export interface ICapakey {
    foundCapakey: boolean,
    value?: string,
    nextField?: string,
}

@Injectable()
export class NodeService {

  private queryTree : IQuery
  private node: INode

  constructor() {
    this.node = {name: 'ROOT', value: '.', children: [
                  {name: 'Gemeente', value: '...', children:[] }
                ]}

    this.queryTree = {name: 'ROOT', children: [
      {name: 'Gemeente',
       searchLenght:3, level:0,
       children:[
      {name: 'Afdeling',
       searchLenght:1, level:1,
       children:[
      {name: 'Sectie',
       searchLenght:1, level:2,
       children:[
      {name: 'Perceel',
       searchLenght:2, level:3,
       children:[]},
    ]}, ]}, ]}, ]}
  }

  public addSelectedToNode(selected: CompleterItem) : ICapakey {
    let lastNode = this.lastNode(this.node)
    lastNode.value = selected.title
    let queryNode = this.findQueryByName(this.queryTree,lastNode.name)
    if ( typeof selected.originalObject === 'object') {
      return {
        foundCapakey : true,
        value: selected.originalObject["capakey"]
      }
    }
    else {
      if (queryNode.children.length == 1) {
          lastNode.children.push({
            name: queryNode.children[0].name,
            path: selected.originalObject,
            value: '...',
            children:[] })
      }
      return {
        foundCapakey : false,
        nextField: queryNode.children[0].name
      }
    }
  }

  public getNodeName() : string {
    return this.lastNode(this.node).name
  }

  public getPath(): string {
    return this.lastNode(this.node).path
  }

  public getSearchLenght() : number {
    let lastNode = this.lastNode(this.node)
    let queryNode = this.findQueryByName(this.queryTree,lastNode.name)
    return queryNode.searchLenght
  }

  public getAutoMatch() : boolean {
    let lastNode = this.lastNode(this.node)
    let queryNode = this.findQueryByName(this.queryTree,lastNode.name)
    return queryNode.autoMatch
  }

  private lastNode(node: INode) : INode {
    if (node.children.length == 1)
      return this.lastNode(node.children[0])
    else
      return node
  }

  private findQueryByName(queryNode:IQuery, name:string) : IQuery {
    if (queryNode.name == name)
      return queryNode
    else
      return this.findQueryByName(queryNode.children[0],name)
  }

}
