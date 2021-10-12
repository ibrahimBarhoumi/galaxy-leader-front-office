import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  public title = 'Confirm';
  public message = 'Are you sure?';
  public confirmButtonLabel = 'Confirm';
  public confirmButtonColor = 'accent';
  public cancelButtonLabel = 'Cancel';

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {
  }


}
