import { Component, OnInit } from '@angular/core';
import {ActivityService} from "../activity.service";
import {MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../core/services/loadingscreen.service";
import {Router} from "@angular/router";
import {concat, Observable, of, Subject, Subscription} from "rxjs";
import {Client} from "../../../core/models/client.model";
import {catchError, distinctUntilChanged, switchMap, tap} from "rxjs/operators";
import {ClientService} from "../../clients/client.service";

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss']
})
export class ActivityDialogComponent implements OnInit {
  clients$: Observable<Client[]>;
  clientInput$ = new Subject<string>();
  clientLoading = false;
  client: Client;
  subscription: Subscription;
  constructor(public activityService: ActivityService,
              public clientService: ClientService,
              public dialogRef: MatDialogRef<ActivityDialogComponent>,
              private loadingService: LoadingService,
              public router: Router) { }

  ngOnInit(): void {
    this.loadPeople();
  }

  onSubmit(): void {
    if (this.activityService.form.valid) {
      // toDo: change :get id from route
      if (!this.activityService.form.get('id').value) {
        this.loadingService.startLoading();
        this.activityService.create(this.activityService.form.value).subscribe(
          () => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 200);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          }
        );
      } else {
        this.activityService.update(this.activityService.form.value).subscribe(() => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 200);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          });
      }
      this.activityService.form.reset();
      this.activityService.initializeFormGroup();
      this.onClose();
    }
  }

  onClose(): void {
    this.activityService.form.reset();
    this.activityService.initializeFormGroup();
    this.dialogRef.close();
  }

  onClear(): void {
    this.activityService.form.reset();
    this.activityService.initializeFormGroup();
  }
  private loadPeople(): void {
    this.clients$ = concat(
      of([]), // default items
      this.clientInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.clientLoading = true)),
        switchMap((term) =>
          this.clientService.search(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.clientLoading = false))
          )
        )
      )
    );
  }
  trackByFn(item: Client): boolean {
    return item.foreign;
  }
}
