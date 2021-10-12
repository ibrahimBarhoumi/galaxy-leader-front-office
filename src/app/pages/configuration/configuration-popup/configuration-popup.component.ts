import {Component, NgZone, OnInit} from '@angular/core';
import {UserService} from "../../users/user.service";
import {MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../core/services/loadingscreen.service";
import {Router} from "@angular/router";
import {RoleService} from "../../roles/role.service";
import {ConfigurationService} from "../configuration.service";

@Component({
  selector: 'app-configuration-popup',
  templateUrl: './configuration-popup.component.html',
  styleUrls: ['./configuration-popup.component.scss']
})
export class ConfigurationPopupComponent implements OnInit {

  constructor(  public configurationService: ConfigurationService,
                public dialogRef: MatDialogRef<ConfigurationPopupComponent>,
                private loadingService: LoadingService,
                public router: Router,) { }

  ngOnInit(): void {
  }


  onSubmit() {
    if (this.configurationService.form.valid) {
      if (!this.configurationService.form.get('id').value) {
        this.loadingService.startLoading();
        this.configurationService.create(this.configurationService.form.value).subscribe(
          () => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 100);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          }
        );
      } else {
        this.configurationService.update(this.configurationService.form.value).subscribe(() => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 100);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          });
      }
      this.configurationService.form.reset();
      this.configurationService.initializeFormGroup();
      this.onClose();
    }
  }

  onClose() {
    this.configurationService.form.reset();
    this.configurationService.initializeFormGroup();
    this.dialogRef.close();

  }

  onClear() {
    this.configurationService.form.reset();
    this.configurationService.initializeFormGroup();
  }
}
