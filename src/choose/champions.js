/// <reference path="typings/angular2/angular2.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var lolApi_1 = require('lolApi');
var ChampionsComponent = (function () {
    function ChampionsComponent(lolApi) {
        var _this = this;
        this.championChanged = new angular2_1.EventEmitter();
        this.champions = { data: [], loading: true, ok: true };
        lolApi.getChampions()
            .subscribe(function (res) { return _this.champions.data = res.json(); }, function (error) { _this.champions.ok = false; _this.champions.loading = false; }, function () { return _this.champions.loading = false; });
        // lolApi.getChampions()
        //   .subscribe(res => this.champions = res);
    }
    ChampionsComponent.prototype.test = function (championKey) {
        this.championChanged.next(championKey);
    };
    __decorate([
        angular2_1.Output(), 
        __metadata('design:type', (typeof EventEmitter !== 'undefined' && EventEmitter) || Object)
    ], ChampionsComponent.prototype, "championChanged");
    ChampionsComponent = __decorate([
        angular2_1.Component({
            selector: 'champions',
            providers: [lolApi_1.LolApi]
        }),
        angular2_1.View({
            templateUrl: 'html/champions.html',
            directives: [angular2_1.NgFor, angular2_1.NgIf, router_1.RouterLink]
        }), 
        __metadata('design:paramtypes', [LolApi])
    ], ChampionsComponent);
    return ChampionsComponent;
})();
exports.ChampionsComponent = ChampionsComponent;
//# sourceMappingURL=champions.js.map