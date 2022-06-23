
//Template for a page
import {Pageable} from "./pageable";
import {Sort} from "./sort";

export interface Page {
  content: any[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}
