import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-club-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.css'],
})
export class ClubMembersComponent implements OnInit {
  currentUser: Users | null = null;
  memberships: any[] = [];
  filteredMemberships: any[] = [];
  nonMembers: Users[] = [];
  filteredNonMembers: Users[] = [];
  loading = true;
  errorMessage: string | null = null;

  // Variables de recherche
  memberSearchTerm: string = '';
  studentSearchTerm: string = '';

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: Users) => {
      this.currentUser = user;
      console.log('Current user:', user); // Vérifier l'utilisateur actuel
      if (user && user.role === 'CLUB') {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = null;

    if (!this.currentUser) return;

    console.log('Chargement des données pour le club ID:', this.currentUser.id);

    this.usersService.getClubMembers(this.currentUser.id).subscribe({
      next: (members: any[]) => {
        console.log('Membres récupérés:', members);
        this.memberships = members;
        this.filteredMemberships = [...members]; // Initialiser la liste filtrée
        this.loadNonMembers();
      },
      error: (err: HttpErrorResponse) => {
        // Utilisation de HttpErrorResponse pour plus de détails
        this.handleDetailedError('Erreur lors du chargement des membres', err);
      },
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  loadNonMembers(): void {
    if (!this.currentUser) return;

    this.usersService.getNonMemberStudents(this.currentUser.id).subscribe({
      next: (nonMembers: Users[]) => {
        console.log('Non-membres récupérés:', nonMembers);
        this.nonMembers = nonMembers;
        this.filteredNonMembers = [...nonMembers]; // Initialiser la liste filtrée
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.handleDetailedError(
          'Erreur lors du chargement des non-membres',
          err
        );
      },
    });
  }

  // Filtrer les membres en fonction du terme de recherche
  filterMembers(): void {
    if (!this.memberSearchTerm.trim()) {
      this.filteredMemberships = [...this.memberships];
      return;
    }

    const searchTerm = this.memberSearchTerm.toLowerCase().trim();
    this.filteredMemberships = this.memberships.filter((membership) =>
      membership.student?.name?.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrer les étudiants disponibles en fonction du terme de recherche
  filterStudents(): void {
    if (!this.studentSearchTerm.trim()) {
      this.filteredNonMembers = [...this.nonMembers];
      return;
    }

    const searchTerm = this.studentSearchTerm.toLowerCase().trim();
    this.filteredNonMembers = this.nonMembers.filter((student) =>
      student.name?.toLowerCase().includes(searchTerm)
    );
  }

  addMember(studentId: number): void {
    if (!this.currentUser) return;

    console.log(
      `Ajout de l'étudiant ${studentId} au club ${this.currentUser.id}`
    );
    this.loading = true;
    this.usersService
      .addMemberToClub(this.currentUser.id, studentId)
      .subscribe({
        next: (response) => {
          console.log('Membre ajouté avec succès:', response);
          this.loadData();
          // Réinitialiser les termes de recherche après l'ajout
          this.memberSearchTerm = '';
          this.studentSearchTerm = '';
        },
        error: (err: HttpErrorResponse) => {
          this.handleDetailedError("Erreur lors de l'ajout du membre", err);
        },
      });
  }

  removeMember(membershipId: number): void {
    if (!this.currentUser) return;

    console.log(
      `Suppression du membership ${membershipId} du club ${this.currentUser.id}`
    );
    this.loading = true;
    this.usersService
      .removeMemberFromClub(this.currentUser.id, membershipId)
      .subscribe({
        next: (response) => {
          console.log('Membre supprimé avec succès:', response);
          this.loadData();
          // Réinitialiser les termes de recherche après la suppression
          this.memberSearchTerm = '';
          this.studentSearchTerm = '';
        },
        error: (err: HttpErrorResponse) => {
          this.handleDetailedError(
            'Erreur lors de la suppression du membre',
            err
          );
        },
      });
  }

  private handleDetailedError(message: string, error: HttpErrorResponse): void {
    // Afficher des détails plus précis sur l'erreur
    this.errorMessage = `${message} (${error.status}: ${error.statusText})`;

    if (error.status === 403) {
      this.errorMessage += ' - Accès interdit. Vérifiez vos permissions.';
    }

    console.error(message, {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message,
      url: error.url,
    });

    this.loading = false;
  }

  // Fonction utilitaire pour rafraîchir les données
  refreshData(): void {
    // Réinitialiser les termes de recherche lors du rafraîchissement
    this.memberSearchTerm = '';
    this.studentSearchTerm = '';
    this.loadData();
  }
}
