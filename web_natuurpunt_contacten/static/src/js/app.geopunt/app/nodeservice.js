"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var NodeService = (function () {
    function NodeService() {
        this.node = { name: 'ROOT', value: '.', children: [
                { name: 'Gemeente', value: '...', children: [] }
            ] };
        this.queryTree = { name: 'ROOT', children: [
                { name: 'Gemeente',
                    searchLenght: 3, level: 0,
                    children: [
                        { name: 'Afdeling',
                            searchLenght: 1, level: 1,
                            children: [
                                { name: 'Sectie',
                                    searchLenght: 1, level: 2,
                                    children: [
                                        { name: 'Perceel',
                                            searchLenght: 2, level: 3,
                                            children: [] },
                                    ] },
                            ] },
                    ] },
            ] };
    }
    NodeService.prototype.addSelectedToNode = function (selected) {
        var lastNode = this.lastNode(this.node);
        lastNode.value = selected.title;
        var queryNode = this.findQueryByName(this.queryTree, lastNode.name);
        if (typeof selected.originalObject === 'object') {
            return {
                foundCapakey: true,
                value: selected.originalObject["capakey"]
            };
        }
        else {
            if (queryNode.children.length == 1) {
                lastNode.children.push({
                    name: queryNode.children[0].name,
                    path: selected.originalObject,
                    value: '...',
                    children: []
                });
            }
            return {
                foundCapakey: false,
                nextField: queryNode.children[0].name
            };
        }
    };
    NodeService.prototype.getNodeName = function () {
        return this.lastNode(this.node).name;
    };
    NodeService.prototype.getPath = function () {
        return this.lastNode(this.node).path;
    };
    NodeService.prototype.getSearchLenght = function () {
        var lastNode = this.lastNode(this.node);
        var queryNode = this.findQueryByName(this.queryTree, lastNode.name);
        return queryNode.searchLenght;
    };
    NodeService.prototype.getAutoMatch = function () {
        var lastNode = this.lastNode(this.node);
        var queryNode = this.findQueryByName(this.queryTree, lastNode.name);
        return queryNode.autoMatch;
    };
    NodeService.prototype.lastNode = function (node) {
        if (node.children.length == 1)
            return this.lastNode(node.children[0]);
        else
            return node;
    };
    NodeService.prototype.findQueryByName = function (queryNode, name) {
        if (queryNode.name == name)
            return queryNode;
        else
            return this.findQueryByName(queryNode.children[0], name);
    };
    return NodeService;
}());
NodeService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], NodeService);
exports.NodeService = NodeService;
//# sourceMappingURL=nodeservice.js.map