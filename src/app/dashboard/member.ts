export interface Member {
  id: number;
  name: string;
  parentName: string;
  expiredDate?: Date;
  status?: string;
  lastInDate?: Date;
  lastOutDate?: Date;
  type?: string;
}