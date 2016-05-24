import {RequestOptions} from 'https';
import {Server, Host} from '../host';

class Response implements Host.Response {
  data: string = '';
  json: string = '';
  status = 200;
  success: boolean = true;
  url: string = '';
  constructor(data?: string) {
    this.data = data;
    try {
      this.json = JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
}

export class ResponseSuccess extends Response {
  status = 200;
  success = true;
}

export class ResponseFailure extends Response {
  status = 404;
  success = false;
}

export class MockServer extends Server {
  public headers = {
    test: 'test'
  };

  public response: Response;
  public mockCache: { url: string, data: any } = { url: '', data: '' };

  constructor() {
    super('', 1234);
  }

  public sendRequest(url: string, region: string, callback: (response: Host.Response) => void): void {
    this.response.url = url;
    callback(this.response);
  }

  public setCache(url: string, data: any) {
    this.mockCache.url = url;
    this.mockCache.data = data;
  }

  private preRun() { }
}
