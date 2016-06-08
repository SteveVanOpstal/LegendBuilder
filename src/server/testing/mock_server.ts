import {RequestOptions} from 'https';
import {Server, HostResponse} from '../server';

export class MockHostResponse implements HostResponse {
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

export class MockHostResponseSuccess extends MockHostResponse {
  status = 200;
  success = true;
}

export class MockHostResponseFailure extends MockHostResponse {
  status = 404;
  success = false;
}

export class MockServer extends Server {
  public headers = {
    test: 'test'
  };

  public responses: Array<{ url: string, message: MockHostResponse }>;
  public mockCache: { url: string, data: any } = { url: '', data: '' };

  constructor() {
    super('', 1234);
  }

  public sendRequest(url: string, region: string, callback: (response: HostResponse) => void): void {
    callback(this.getResponse(url));
  }

  public setCache(url: string, data: any) {
    this.mockCache.url = url;
    this.mockCache.data = data;
  }

  public getResponse(url: string): MockHostResponse {
    for (let response of this.responses) {
      if (url.indexOf(response.url) >= 0) {
        return response.message;
      }
    }
    throw 'Error in MockServer';
  }

  private preRun() { }
}
