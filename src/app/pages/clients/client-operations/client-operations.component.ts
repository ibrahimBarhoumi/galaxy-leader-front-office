import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ClientService} from '../client.service';
import {Router} from '@angular/router';
import {LoadingService} from '../../../core/services/loadingscreen.service';

@Component({
  selector: 'app-client-operations',
  templateUrl: './client-operations.component.html',
  styleUrls: ['./client-operations.component.scss']
})
export class ClientOperationsComponent implements OnInit {


  constructor(public clientService: ClientService,
              public dialogRef: MatDialogRef<ClientOperationsComponent>,
              private loadingService: LoadingService,
              public router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.clientService.form.valid) {
      // toDo: change :get id from route
      if (!this.clientService.form.get('id').value) {
        this.loadingService.startLoading();
        this.clientService.create(this.clientService.form.value).subscribe(
          () => {
            setTimeout(() => {
              this.loadingService.stopLoading();
              // toDo: refresh DataSource
              window.location.reload();
            }, 500);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          }
        );
      } else {
        this.clientService.update(this.clientService.form.value).subscribe(() => {
            setTimeout(() => {
              this.loadingService.stopLoading();
              // toDo: refresh DataSource
              window.location.reload();
            }, 500);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          });
      }
      this.clientService.form.reset();
      this.clientService.initializeFormGroup();
      this.onClose();
    }
  }

  onClose(): void {
    this.clientService.form.reset();
    this.clientService.initializeFormGroup();
    this.dialogRef.close();
  }

  onClear(): void {
    this.clientService.form.reset();
    this.clientService.initializeFormGroup();
  }
}
