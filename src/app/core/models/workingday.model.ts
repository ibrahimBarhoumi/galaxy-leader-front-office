import { Activity } from './activity.model';
import { Publicholiday } from './publicholiday.model';
import { Resource } from './resource';

export class WorkingDay  extends Resource {
  publicHoliday: Publicholiday;
  date: Date;
  dayOfWeek: number;
  morningActivity?: Activity;
  afternoonActivity?: Activity;
  workedHoursNumber: number;
}
