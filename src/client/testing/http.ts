import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

export class MockMockBackend extends MockBackend {
  private connection;

  constructor() {
    super();
    this.connections.subscribe(c => {
      this.connection = c;
      if (/all\/status\/shard-data/.test(this.connection.request.url)) {
        this.connection.mockRespond(new Response(
            new ResponseOptions({status: 200, body: [{slug: 'euw', hostname: 'euw1.test'}]})));
      }
    });
  }

  success(body: string|Object|ArrayBuffer|Blob = {}) {
    this.connection.mockRespond(new Response(new ResponseOptions({status: 200, body: body})));
  }

  error() {
    this.connection.mockError();
  }

  subscribe(callback: (connection: MockConnection) => void) {
    callback(this.connection);
  }
}
