export class Accommodation {
///TODO: use number for id
constructor(public id: string,
    public name: string,
    public phone: string,
    public address: string,
    public web: string,
    public price: number,
    public mail: string,
    public lat: number,
    public lng: number,
    ///TODO: use a collection or 3 variable for voucherCards
    public voucherCard: string,
    public trail: string,
    public positiveFeedback: number,
    public neutralFeedback: number,
    public negativeFeedback: number) { }
}

export interface AccommodationResponse {
  accommodation: Accommodation;
}
