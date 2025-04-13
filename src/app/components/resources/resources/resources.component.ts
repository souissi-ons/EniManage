import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Resource } from 'src/app/models/resource';
import { ResourceService } from 'src/app/services/resource.service';
import { PopupComponent } from '../../common/popup/popup.component';
import { AddResourceComponent } from '../add-resource/add-resource.component';
import { EditResourceComponent } from '../edit-resource/edit-resource.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PopupComponent,
    AddResourceComponent,
    EditResourceComponent,
    ConfirmationDialogComponent,
  ],
})
export class ResourcesComponent implements OnInit {
  resources: Resource[] = [];
  showAddResourcePopup: boolean = false;
  showEditResourcePopup: boolean = false;
  showDeleteResourcePopup: boolean = false;
  selectedResource: Resource | null = null;
  selectedName: string = '';
  itemToDeleteId: number | null | undefined = null;

  constructor(private resourceService: ResourceService) {}

  ngOnInit() {
    this.loadResources();
  }

  loadResources() {
    this.resourceService.getResources().subscribe((data: Resource[]) => {
      this.resources = data;
    });
  }

  openAddResourcePopup() {
    this.showAddResourcePopup = true;
  }

  closeAddResourcePopup() {
    this.showAddResourcePopup = false;
    this.loadResources();
  }

  openEditResourcePopup(resource: Resource) {
    this.selectedResource = resource;
    this.showEditResourcePopup = true;
  }

  closeEditResourcePopup() {
    this.showEditResourcePopup = false;
    this.loadResources();
  }

  openDeleteResourcePopup(resource: Resource) {
    this.selectedName = resource.name;
    this.itemToDeleteId = resource.id;
    this.showDeleteResourcePopup = true;
  }

  closeDeleteResourcePopup() {
    this.showDeleteResourcePopup = false;
    this.resetDeleteState();
  }

  handleDeleteConfirmation(confirmed: boolean) {
    if (confirmed && this.itemToDeleteId) {
      this.resourceService.deleteResource(this.itemToDeleteId).subscribe({
        next: () => {
          this.loadResources();
        },
        error: (err) => {
          console.error('Error deleting resource:', err);
        },
      });
    }
    this.closeDeleteResourcePopup();
  }

  private resetDeleteState() {
    this.selectedName = '';
    this.itemToDeleteId = null;
  }
}
