export class Pin {
    constructor(public id: number, public lng: number, public lat: number) {
    }
}

export interface PinsResponse {
  coordinates: Pin[];
}
