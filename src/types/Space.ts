import { IGroup } from "./Group";

export interface ISpace {
  id: string;
  name: string;
  description: string;
  creatorEmail: string;
  memberEmails: string[];
  groups: IGroup[];
}
