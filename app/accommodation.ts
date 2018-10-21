export class Accommodation {

	constructor(public id: string,
	public name: string,
	public phone: string,
	public address: string,
	public web: string,
	public price: string,
	public mail: string,
	public lat: number,
	public lng: number,
	public szepKartya: string,
	public trail: string,
	public positiveFeedback: number,
	public neutralFeedback: number,
	public negativeFeedback: number)
	{ 
	}
}

export interface AccommodationResponse {
  accommodation: Accommodation;
}