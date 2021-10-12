import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../core/services/loadingscreen.service";
import {Router} from "@angular/router";
import {RoleService} from "../role.service";

@Component({
  selector: 'app-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.scss']
})
export class RolesDialogComponent implements OnInit {

  constructor(public roleService: RoleService,
              public dialogRef: MatDialogRef<RolesDialogComponent>,
              private loadingService: LoadingService,
              public router: Router,) { }

  ngOnInit(): void {
  }
  onSubmit() {
    if (this.roleService.form.valid) {
      // toDo: change :get id from route
      if (!this.roleService.form.get('id').value) {
        this.loadingService.startLoading();
        this.roleService.create(this.roleService.form.value).subscribe(
          () => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 350);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          }
        );
      } else {
        this.roleService.update(this.roleService.form.value).subscribe(() => {
            setTimeout(() => {
              this.loadingService.stopLoading();
            }, 350);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          });
      }
      this.roleService.form.reset();
      this.roleService.initializeFormGroup();
      this.onClose();
    }
  }

  onClose() {
    this.roleService.form.reset();
    this.roleService.initializeFormGroup();
    this.dialogRef.close();

  }

  onClear() {
    this.roleService.form.reset();
    this.roleService.initializeFormGroup();
  }

}
