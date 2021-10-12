import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { UIModule } from '../../shared/ui/ui.module';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { UserComponent } from './user.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TranslateModule } from '@ngx-translate/core';
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
import { UsersPopupComponent } from './users-popup/users-popup.component';
import {ClientOperationsComponent} from "../clients/client-operations/client-operations.component";

@NgModule({
  declarations: [UserComponent, UsersPopupComponent],
  imports: [
    CommonModule,
    UIModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FormsModule,
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
    NgMultiSelectDropDownModule.forRoot(),
  ],
  entryComponents: [ UsersPopupComponent]
})
export class UserModule { }
