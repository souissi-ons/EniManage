import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { PopupComponent } from '../../common/popup/popup.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PopupComponent,
    AddUserComponent,
    UpdateUserComponent,
    ConfirmationDialogComponent,
  ],
})
export class UsersComponent implements OnInit {
  users: Users[] = [];
  showAddUserPopup: boolean = false;
  showEditUserPopup: boolean = false;
  showDeleteUserPopup: boolean = false;
  selectedUser: Users | null = null;
  selectedName: string = '';
  itemToDeleteId: number | null = null;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: Users[]) => {
      this.users = data;
    });
  }

  openAddUserPopup() {
    this.showAddUserPopup = true;
  }

  closeAddUserPopup() {
    this.showAddUserPopup = false;
    this.loadUsers();
  }

  openEditUserPopup(user: Users) {
    this.selectedUser = user;
    this.showEditUserPopup = true;
  }

  closeEditUserPopup() {
    this.showEditUserPopup = false;
    this.loadUsers();
  }

  openDeleteUserPopup(user: Users) {
    this.selectedName = user.name;
    this.itemToDeleteId = user.id;
    this.showDeleteUserPopup = true;
  }

  closeDeleteUserPopup() {
    this.showDeleteUserPopup = false;
    this.resetDeleteState();
  }

  handleDeleteConfirmation(confirmed: boolean) {
    if (confirmed && this.itemToDeleteId) {
      this.userService.deleteUser(this.itemToDeleteId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        },
      });
    }
    this.closeDeleteUserPopup();
  }

  private resetDeleteState() {
    this.selectedName = '';
    this.itemToDeleteId = null;
  }
}
