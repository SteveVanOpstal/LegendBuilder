import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

export class MockMockBackend extends MockBackend {
  constructor() {
    super();
  }

  success(body: string|Object|ArrayBuffer|Blob = {}) {
    this.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({status: 200, body: body})));
    });
  }

  error() {
    this.subscribe((connection: MockConnection) => {
      connection.mockError();
    });
  }

  private subscribe(callback: (connection: MockConnection) => void) {
    this.connections.subscribe((connection: MockConnection) => {
      if (connection.request.url === 'http://status.leagueoflegends.com/shards') {
        connection.mockRespond(
            new Response(new ResponseOptions({status: 200, body: [{'slug': 'euw'}]})));
      } else {
        callback(connection);
      }
    });
  }
}
