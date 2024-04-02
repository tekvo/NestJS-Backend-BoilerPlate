/**
 * Interface representing the structure of a response body.
 * @interface
 */
export interface IResponseBody {
  statusCode: number;
  timestamp: string;
  error: any;
  data: any;
}

export interface IStatusMessage {
  statusCode: number;
  message: string;
  type: string;
}
