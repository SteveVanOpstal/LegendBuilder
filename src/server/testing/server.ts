import {HostResponse, Server} from '../server';

export class MockHostResponse implements HostResponse {
  data = '';
  json = '';
  status = 200;
  success = true;
  url = '';
  constructor(data?: string) {
    this.data = data || '';
    if (data) {
      this.json = JSON.parse(this.data);
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
  responses: Array<{url: string, message: MockHostResponse}>;
  mockCache: {url: string, data: any} = {url: '', data: ''};

  constructor() {
    super(1234);
  }

  run(_callback: (req, resp) => void): void {}

  sendRequest(url: string, _region: string, callback: (response: HostResponse) => void): void {
    callback(this.getResponse(url));
  }

  setCache(url: string, data: any): void {
    this.mockCache.url = url;
    this.mockCache.data = data;
  }

  readFile(_filename: string): string {
    return '';
  }

  watchFile(_filename: string, _listener: FunctionStringCallback): void {}

  private getResponse(url: string): MockHostResponse {
    for (const response of this.responses) {
      if (url.indexOf(response.url) >= 0) {
        return response.message;
      }
    }
    throw Error('Error in MockServer');
  }
}
