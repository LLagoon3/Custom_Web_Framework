import { statusMsg } from '../util/const';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(statusMsg[status] || message);
    this.status = status;
    this.name = 'HttpError';
  }
}