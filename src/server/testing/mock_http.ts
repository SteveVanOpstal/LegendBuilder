import {IncomingMessage, ServerResponse} from 'http';


export class MockIncomingMessage implements IncomingMessage {
  url: string;
};

export class MockServerResponse implements ServerResponse {
  buffer: Buffer;
  private headers: any;

  write(buffer: Buffer): boolean {
    this.buffer = buffer;
    return true;
  }
  writeHead(statusCode: number, headers?: any): void {
    this.headers = headers;
  }
  getHeader(name: string): string {
    return this.headers[name];
  }
  end() { }
}
