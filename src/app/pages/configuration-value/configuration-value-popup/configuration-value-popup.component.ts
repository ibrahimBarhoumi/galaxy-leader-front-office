import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../core/services/loadingscreen.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigValueService} from "../configuration-value.service";
import {Configuration} from "../../../core/models/configuration.model";

@Component({
  selector: 'app-configuration-value-popup',
  templateUrl: './configuration-value-popup.component.html',
  styleUrls: ['./configuration-value-popup.component.scss']
})
export class ConfigurationValuePopupComponent implements OnInit {
  idConfiguration: number;


  constructor(public dialogRef: MatDialogRef<ConfigurationValuePopupComponent>,
              private loadingService: LoadingService,
              public router: Router,
              public configurationValueService: ConfigValueService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.configurationValueService.form.valid) {
      // toDo: change :get id from route
      if (!this.configurationValueService.form.get('id').value) {
        this.loadingService.startLoading();
        this.configurationValueService.create(this.configurationValueService.form.value).subscribe(
          () => {
            setTimeout(() => {
              this.loadingService.stopLoading();
            }, 250);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          }
        );
      } else {
        this.configurationValueService.update(this.configurationValueService.form.value).subscribe(() => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 250);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          });
      }
      this.configurationValueService.form.reset();
      this.configurationValueService.initializeFormGroup();
      this.onClose();
    }
  }

  onClose() {
    this.configurationValueService.form.reset();
    this.configurationValueService.initializeFormGroup();
    this.dialogRef.close();

  }

  onClear() {
    this.configurationValueService.form.reset();
    this.configurationValueService.initializeFormGroup();
  }
}
