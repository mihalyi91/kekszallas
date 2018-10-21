export class Pin {
	constructor(public id: number,public lng: string,public lat: string)
	{ 	
	}
}

export interface PinsResponse {
  coordinates: Pin[];
}