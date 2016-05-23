//import {Buffer} from 'node';
import {IncomingMessage, ServerResponse} from 'http';
//import * as NodeJS from "NodeJS";
import * as net from 'net';


export class MockIncomingMessage implements IncomingMessage {
  url: string;
};

// export interface MockIncomingMessage extends events.EventEmitter, stream.Readable {
//   httpVersion: string;
//   headers: any;
//   rawHeaders: string[];
//   trailers: any;
//   rawTrailers: any;
//   setTimeout(msecs: number, callback: Function): NodeJS.Timer
//   {

//   };
//   // /**
//   //  * Only valid for request obtained from http.Server.
//   //  */
//   // method?: string;
//   // /**
//   //  * Only valid for request obtained from http.Server.
//   //  */
//   // url?: string;
//   // /**
//   //  * Only valid for response obtained from http.ClientRequest.
//   //  */
//   // statusCode?: number;
//   // /**
//   //  * Only valid for response obtained from http.ClientRequest.
//   //  */
//   // statusMessage?: string;
//   socket: net.Socket;
// }

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
