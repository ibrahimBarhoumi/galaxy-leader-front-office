import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTypeaheadModule,
  NgbCollapseModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ActivityComponent } from './activity.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {ConfirmDialogModule} from "../../common/confirm-dialog/confirm-dialog.module";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
  declarations: [ActivityComponent, ActivityDialogComponent],
  imports: [
    CommonModule,
    UIModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    ConfirmDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatGridListModule,
    MatToolbarModule,
  ],
})
export class ActivityModule {}
