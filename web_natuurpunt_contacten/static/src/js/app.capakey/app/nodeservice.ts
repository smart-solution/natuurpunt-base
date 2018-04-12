import {Injectable} from '@angular/core'
import { CompleterItem } from 'ng2-completer'

export interface INode {
    name: string,
    value: string,
    left_right?: number[],
    children: INode[],
}

export interface IQuery {
    name: string,
    searchLenght?: number,
    query?: string,
    level?: number,
    autoMatch?: boolean,
    children: IQuery[]
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
  private default_query: string = "select name,lft,rgh,level,children from fdw_capakey where name = '{0}'"

  constructor() {
    this.node = {name: 'ROOT', value: '.', children: [
                  {name: 'naam_fusiegemeente', value: '...', children:[] }
                ]}

    this.queryTree = {name: 'ROOT', children: [
      {name: 'naam_fusiegemeente',
       searchLenght:3, level:0,
       query: "select name,lft,rgh,level,children from fdw_capakey where name ilike '{0}%' and parent = 0",
       children:[
      {name: 'afdeling',
       searchLenght:1, level:1,
       children:[
      {name: 'sectie',
       searchLenght:1, level:2, autoMatch:false,
       children:[
      {name: 'grondnr',
       searchLenght:1, level:3, autoMatch:false,
       children:[
      {name: 'exponent',
       searchLenght:1, level:4, autoMatch:false,
       children:[
      {name: 'macht',
       searchLenght:1, level:5, autoMatch:false,
       children:[
      {name: 'bisnr',
       searchLenght:1, level:6, autoMatch:false,
       children:[]},
    ]}, ]}, ]}, ]}, ]}, ]}, ]}

  }

  public addSelectedToNode(selected: CompleterItem) : ICapakey {
    let lastNode = this.lastNode(this.node)
    lastNode.value = selected.title
    let queryNode = this.findQueryByName(this.queryTree,lastNode.name)
    if ( typeof selected.originalObject[selected.title] === 'string') {
      return {
        foundCapakey : true,
        value: selected.originalObject[selected.title]
      }
    }
    else {
      if (queryNode.children.length == 1) {
          lastNode.children.push({
            name: queryNode.children[0].name,
            left_right: selected.originalObject[selected.title],
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

  public getSearchQuery(searchString: string) : string {
    let lastNode = this.lastNode(this.node)
    let queryNode = this.findQueryByName(this.queryTree,lastNode.name)
    let reg = new RegExp("\\{0\\}", "gm")
    let query = queryNode.query ? queryNode.query.replace(reg, searchString)
                : this.default_query.replace(reg, searchString)
    return lastNode.left_right
           ? query.concat(
             ' AND lft >',
             String(lastNode.left_right[0]),
             ' AND rgh <',
             String(lastNode.left_right[1]),
             ' AND level =',
             String(queryNode.level)
             )
           : query
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
