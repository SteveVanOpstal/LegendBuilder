///<reference path="typings/angular2/angular2.d.ts"/>
///<reference path="typings/angular2/http.d.ts"/>
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
var http_1 = require('angular2/http');
var LolApi = (function () {
    function LolApi(http) {
        this.http = http;
    }
    LolApi.prototype.getChampions = function () {
        var _this = this;
        return this.http.get('http://127.0.0.1:12345/champion?champData=image')
            .map(function (res) { return res = _this.HandleResponse(res); });
    };
    LolApi.prototype.HandleResponse = function (res) {
        var options = new http_1.BaseResponseOptions();
        return new http_1.Response(options.merge({ body: this.ObjectToArray(res.json()['data']) }));
    };
    LolApi.prototype.ObjectToArray = function (obj) {
        var arr = Array();
        for (var property in obj) {
            arr.push(obj[property]);
        }
        return arr;
    };
    LolApi = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof Http !== 'undefined' && Http) || Object])
    ], LolApi);
    return LolApi;
})();
exports.LolApi = LolApi;
//# sourceMappingURL=lolApi.js.map