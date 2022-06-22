export interface Report {
  id: number;
  vin: string;
  frameDamage: boolean;
  hasAccidents: boolean;
  theftTitle: boolean;
  ownerCount: number;
  salvage: boolean;
}
