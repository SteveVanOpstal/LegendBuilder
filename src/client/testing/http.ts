import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

export class MockMockBackend extends MockBackend {
  constructor() {
    super();
  }

  subscribe(error: boolean = true, body?: any) {
    this.connections.subscribe((connection: MockConnection) => {
      if (connection.request.url === 'http://status.leagueoflegends.com/shards') {
        connection.mockRespond(
            new Response(new ResponseOptions({status: 200, body: [{'slug': 'euw'}]})));
      } else {
        if (error) {
          connection.mockError();
        } else {
          connection.mockRespond(new Response(new ResponseOptions({status: 200, body: body})));
        }
      }
    });
  }
}
