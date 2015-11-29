///<reference path="typings/angular2/angular2.d.ts"/>
///<reference path="typings/angular2/http.d.ts"/>

import {Injectable, bind} from 'angular2/angular2';
import {Http, Headers, Response, BaseResponseOptions} from 'angular2/http';

@Injectable()
export class LolApi {
  constructor(public http: Http) {
  }
  
  public getChampions() {
    return this.http.get('http://127.0.0.1:12345/champion?champData=image')
      .map(res => res = this.HandleResponse(res))
  }
  
  private HandleResponse(res: Response): Response {
    var options = new BaseResponseOptions();
    return new Response(options.merge({body: this.ObjectToArray(res.json()['data'])}));
  }

  private ObjectToArray(obj: Object): Array<Object> {
    var arr = Array<Object>();
    for (var property in obj) {
      arr.push(obj[property]);
    }
    return arr;
  }
}