import {Make} from "../api/make";

export interface ModelModel {
  id: number;
  make: Make
  name: string;
  selected: boolean;
}

