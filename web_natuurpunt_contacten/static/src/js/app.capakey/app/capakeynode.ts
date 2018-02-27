import { Component, Input } from '@angular/core'
import { OnInit } from '@angular/core'
import { INode } from './nodeservice'

@Component({
  selector: 'capakey-node',
  template: `
  <ul>
    <li *ngFor="let node of node.children">
      <div [ngClass]="node.children.length > 0 ? 'tree': 'endtree'">
      {{node.name}}:{{node.value}}</div>
      <capakey-node [node]="node"></capakey-node>
    </li>
  </ul>`,
  styles: [`.clt, {
              font-family: sans-serif;
              position: relative;
            }
            .endtree {
              text-indent: 0em;
            }
            .tree {
              border-left: .2em solid gray;
              border-bottom: .2em solid gray;
              position: relative;
              left: -1.3em;
              height: 3em;
              width: 2em;
            }
            ul ul {
              margin-top: -1em;
              list-style-type: none;
            }
            li {
              list-style-type: none;
              font-family: sans-serif;
              position: relative;
              bottom: -0.4em;
              text-indent: 1em;
            }
            li:after {
              content: '';
              width: 1em;
              height: 1em;
              position: absolute;
              background: salmon;
              border: .125em solid white;
              top: -0.1em;
              left: -1.9em;
            }
`]
})
export class CapakeyNodeComponent implements OnInit {
  @Input() node: INode

  ngOnInit() {}
}
