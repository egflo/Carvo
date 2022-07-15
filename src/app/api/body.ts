import {BodyType} from "./body-type";

export interface Body {
  id: number;
  bodyType: BodyType;
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  frontLegroom: string;
  backLegroom: string;
  bedLength: string;
  cabin: string;
}
