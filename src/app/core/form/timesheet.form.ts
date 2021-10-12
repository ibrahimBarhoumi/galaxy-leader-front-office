import { Activity } from '../models/activity.model';

export class TimesheetForm {
  id: number;
  date?: Date;
  dateFrom?: Date;
  dateTo?: Date;
  activity?: Activity;
  morningActivity?: Activity;
  afternoonActivity?: Activity;
  isFullDay = true;
  isPeriod = false;
  nbrHours = 7;
  firstDay?: string;
  lastDay?: string;
}
