export interface IGroupSpace {
  id: string;
  name: string;
  description: string;
  creatorEmail: string;
  memberEmails: string[];
  groupIds: string[];
}
