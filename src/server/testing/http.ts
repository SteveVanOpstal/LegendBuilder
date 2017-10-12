import {OutgoingHttpHeaders} from 'http';

export class MockServerResponse {
  buffer: any;
  private headers: any;

  write(buffer: any): boolean {
    this.buffer = buffer;
    return true;
  }

  writeHead(_statusCode: number, headers?: OutgoingHttpHeaders): void {
    this.headers = headers;
  }

  getHeader(name: string): string {
    if (!this.headers) {
      return '[no headers]';
    }
    return this.headers[name];
  }

  end() {}
}
