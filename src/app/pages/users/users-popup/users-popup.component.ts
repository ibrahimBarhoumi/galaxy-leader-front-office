import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../core/services/loadingscreen.service";
import {Router} from "@angular/router";
import {Role} from "../../../core/models/role.model";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {RoleService} from "../../roles/role.service";
import {QueryOptions} from "../../../core/models/query-options";

@Component({
  selector: 'app-users-popup',
  templateUrl: './users-popup.component.html',
  styleUrls: ['./users-popup.component.scss']
})
export class UsersPopupComponent implements OnInit {
  page = 1;
  pageSize = 10;
  dropdownList:Role[] = [];
  selectedItems:Role[] = [];
  dropdownSettings:IDropdownSettings = {};
  roleLoding = true
  constructor(
    public userService: UserService,
    public dialogRef: MatDialogRef<UsersPopupComponent>,
    private loadingService: LoadingService,
    public router: Router,
    private roleService: RoleService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.getRoles()
    })


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }
  ngAfterContentChecked() {
    console.log(this.cd.detectChanges());
  }
  onSubmit(): void {
    if (this.userService.form.valid) {
      // toDo: change :get id from route
      if (!this.userService.form.get('id').value) {
        this.loadingService.startLoading();
        this.userService.create(this.userService.form.value).subscribe(
          () => {
            setTimeout(() => {
              this.loadingService.stopLoading();

            }, 500);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          }
        );
      } else {
        this.userService.update(this.userService.form.value).subscribe(() => {
            setTimeout(() => {
              this.loadingService.stopLoading();
            }, 500);
          },
          () => {
          },
          () => {
            this.loadingService.stopLoading();
          });
      }
      this.userService.form.reset();
      this.userService.initializeFormGroup();
      this.onClose();
    }
  }

  onClose(): void {
    this.userService.form.reset();
    this.userService.initializeFormGroup();
    this.dialogRef.close();
  }

  onClear(): void {
    this.userService.form.reset();
    this.userService.initializeFormGroup();
  }
  getRoles(){
    this.roleService.list(new QueryOptions(this.page - 1, this.pageSize)).subscribe(
      (data) => {

        setTimeout(() => {

          this.dropdownList = data['content']
        }, 500);

      },
    );

  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    console.log(this.selectedItems)
  }
  onSelectAll(items: any) {
    this.selectedItems = items;
  }

}
