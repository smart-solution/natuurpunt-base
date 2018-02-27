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
        this.default_query = "select name,lft,rgh,level,children from fdw_capakey where name = '{0}'";
        this.node = { name: 'ROOT', value: '.', children: [
                { name: 'naam_fusiegemeente', value: '...', children: [] }
            ] };
        this.queryTree = { name: 'ROOT', children: [
                { name: 'naam_fusiegemeente',
                    searchLenght: 3, level: 0,
                    query: "select name,lft,rgh,level,children from fdw_capakey where name ilike '{0}%' and parent = 0",
                    children: [
                        { name: 'afdeling',
                            searchLenght: 1, level: 1,
                            children: [
                                { name: 'sectie',
                                    searchLenght: 1, level: 2, autoMatch: false,
                                    children: [
                                        { name: 'grondnr',
                                            searchLenght: 1, level: 3, autoMatch: false,
                                            children: [
                                                { name: 'exponent',
                                                    searchLenght: 1, level: 4, autoMatch: false,
                                                    children: [
                                                        { name: 'macht',
                                                            searchLenght: 1, level: 5, autoMatch: false,
                                                            children: [
                                                                { name: 'bisnr',
                                                                    searchLenght: 1, level: 6, autoMatch: false,
                                                                    children: [] },
                                                            ] },
                                                    ] },
                                            ] },
                                    ] },
                            ] },
                    ] },
            ] };
    }
    NodeService.prototype.addSelectedToNode = function (selected) {
        var lastNode = this.lastNode(this.node);
        lastNode.value = selected.title;
        var queryNode = this.findQueryByName(this.queryTree, lastNode.name);
        if (typeof selected.originalObject[selected.title] === 'string') {
            return {
                foundCapakey: true,
                value: selected.originalObject[selected.title]
            };
        }
        else {
            if (queryNode.children.length == 1) {
                lastNode.children.push({
                    name: queryNode.children[0].name,
                    left_right: selected.originalObject[selected.title],
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
    NodeService.prototype.getSearchQuery = function (searchString) {
        var lastNode = this.lastNode(this.node);
        var queryNode = this.findQueryByName(this.queryTree, lastNode.name);
        var reg = new RegExp("\\{0\\}", "gm");
        var query = queryNode.query ? queryNode.query.replace(reg, searchString)
            : this.default_query.replace(reg, searchString);
        return lastNode.left_right
            ? query.concat(' AND lft >', String(lastNode.left_right[0]), ' AND rgh <', String(lastNode.left_right[1]), ' AND level =', String(queryNode.level))
            : query;
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