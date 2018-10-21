import { Accommodation } from '../accommodation';

export class Status {
	constructor(public message: string, public status: string)
	{ }
}

export interface StatusResponse {
  result: Status;
}

export interface EditResponse {
  result: Status;
  accommodation: Accommodation;
}