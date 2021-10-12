import { User } from './auth.models';
import { Resource } from './resource';
import { WorkingDay } from './workingday.model';

export class Timesheet  extends Resource  {
  collaborator: User;
  date: Date;
  status: string;
  convention: string;
  workingDays: WorkingDay[];
}
