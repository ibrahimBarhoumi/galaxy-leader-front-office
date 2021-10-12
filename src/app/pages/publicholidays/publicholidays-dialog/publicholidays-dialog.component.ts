import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../core/services/loadingscreen.service";
import {Router} from "@angular/router";
import {PublicholidayService} from "../publicholiday.service";

@Component({
  selector: 'app-publicholidays-dialog',
  templateUrl: './publicholidays-dialog.component.html',
  styleUrls: ['./publicholidays-dialog.component.scss']
})
export class PublicholidaysDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PublicholidaysDialogComponent>,
              private loadingService: LoadingService,
              public router: Router,
              public publicHolidayService: PublicholidayService) { }

  ngOnInit(): void {
  }
  onSubmit() {
    if (this.publicHolidayService.form.valid) {
      // toDo: change :get id from route
      if (!this.publicHolidayService.form.get('id').value) {
        this.loadingService.startLoading();
        this.publicHolidayService.create(this.publicHolidayService.form.value).subscribe(
          () => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 400);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          }
        );
      } else {
        this.publicHolidayService.update(this.publicHolidayService.form.value).subscribe(() => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 400);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          });
      }
      this.publicHolidayService.form.reset();
      this.publicHolidayService.initializeFormGroup();
      this.onClose();
    }
  }

  onClose() {
    this.publicHolidayService.form.reset();
    this.publicHolidayService.initializeFormGroup();
    this.dialogRef.close();

  }

  onClear() {
    this.publicHolidayService.form.reset();
    this.publicHolidayService.initializeFormGroup();
  }
}
