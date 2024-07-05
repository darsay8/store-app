import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.scss',
})
export class UserAdminComponent {
  users: User[] = [];
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
    this.currentUser = this.authService.getCurrentUser();
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.userService.deleteUser(user.id).subscribe(
        () => {
          console.log(`User ${user.username} deleted successfully.`);
          // Update the users list after deletion (optional)
          this.users = this.users.filter((u) => u.id !== user.id);
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  editUser(user: User): void {
    //  this.router.navigate([`/edit-user/${user.id}`]);
    console.log('edit user:', user);
  }

  isAdmin(): boolean {
    return this.storageService.getItem('currentUser').isAdmin;
  }
}