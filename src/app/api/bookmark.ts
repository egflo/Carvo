import {Auto} from "./auto";

export interface Bookmark {
  id: number;
  userId: number;
  autoId: number;
  created: Date;
  auto?: Auto;
}
