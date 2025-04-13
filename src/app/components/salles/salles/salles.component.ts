import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PopupComponent } from '../../common/popup/popup.component';
import { AddSalleComponent } from '../../salles/add-salle/add-salle.component';
import { EditSalleComponent } from '../../salles/edit-salle/edit-salle.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { Salle } from 'src/app/models/salle';
import { SalleService } from 'src/app/services/salle.service';

@Component({
  selector: 'app-salles',
  templateUrl: './salles.component.html',
  styleUrls: ['./salles.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PopupComponent,
    AddSalleComponent,
    EditSalleComponent,
    ConfirmationDialogComponent,
  ],
})
export class SallesComponent implements OnInit {
  salles: Salle[] = [];
  showAddSallePopup: boolean = false;
  showEditSallePopup: boolean = false;
  showDeleteSallePopup: boolean = false;
  selectedSalle: Salle | null = null;
  selectedName: string = '';
  itemToDeleteId: number | null | undefined = null;

  constructor(private salleService: SalleService) {}

  ngOnInit() {
    this.loadSalles();
  }

  loadSalles() {
    this.salleService.getAllSalles().subscribe((data: Salle[]) => {
      this.salles = data;
    });
  }

  openAddSallePopup() {
    this.showAddSallePopup = true;
  }

  closeAddSallePopup() {
    this.showAddSallePopup = false;
    this.loadSalles();
  }

  openEditSallePopup(salle: Salle) {
    this.selectedSalle = salle;
    this.showEditSallePopup = true;
  }

  closeEditSallePopup() {
    this.showEditSallePopup = false;
    this.loadSalles();
  }

  openDeleteSallePopup(salle: Salle) {
    this.selectedName = salle.name;
    this.itemToDeleteId = salle.id;
    this.showDeleteSallePopup = true;
  }

  closeDeleteSallePopup() {
    this.showDeleteSallePopup = false;
    this.resetDeleteState();
  }

  handleDeleteConfirmation(confirmed: boolean) {
    if (confirmed && this.itemToDeleteId) {
      this.salleService.deleteSalle(this.itemToDeleteId).subscribe({
        next: () => {
          this.loadSalles();
        },
        error: (err) => {
          console.error('Error deleting salle:', err);
        },
      });
    }
    this.closeDeleteSallePopup();
  }

  private resetDeleteState() {
    this.selectedName = '';
    this.itemToDeleteId = null;
  }
}
