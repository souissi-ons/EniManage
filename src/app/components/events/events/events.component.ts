// event-grid.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent,ReactiveFormsModule],
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  error = '';
  eventsForm: FormGroup | undefined;
  
  // Search and filter properties
  searchTerm = '';
  filterCategory = '';
  sortBy = 'date_asc';
  categories: string[] = [];
  
  // Pagination properties
  itemsPerPage = 8;
  currentPage = 1;
  totalPages = 1;
  
  constructor(
    private eventsService: EventsService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadEvents();
    this.loadCategories();
    sortBy: new FormControl('date_asc') 
  }
  
  loadEvents() {
    this.loading = true;
    this.eventsService.getEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.applyFiltersAndPagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.error = 'Failed to load events. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  loadCategories() {
    // This would typically come from your API
    // For now, we'll use a static list
    this.categories = ['Workshop', 'Conference', 'Networking', 'Seminar', 'Virtual'];
  }
  
  filterEvents() {
    this.currentPage = 1; // Reset to first page when filter changes
    this.applyFiltersAndPagination();
  }
  
  sortEvents() {
    this.applyFiltersAndPagination();
  }
  
  applyFiltersAndPagination() {
    // First apply search and category filters
    let filtered = [...this.events];
    
    // Apply search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) || 
        (event.description && event.description.toLowerCase().includes(term))
      );
    }
    

    
    // Apply sorting
    switch(this.sortBy) {
      case 'date_asc':
        filtered.sort((a, b) => 
          new Date(a.date_start || 0).getTime() - new Date(b.date_start || 0).getTime()
        );
        break;
      case 'date_desc':
        filtered.sort((a, b) => 
          new Date(b.date_start || 0).getTime() - new Date(a.date_start || 0).getTime()
        );
        break;
      case 'popularity':
        filtered.sort((a, b) => 
          (b.currentParticipants || 0) - (a.currentParticipants || 0)
        );
        break;
    }
    
    // Calculate pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredEvents = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }
  
  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max to show
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of the middle range
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust if at the edges
      if (this.currentPage <= 2) {
        end = 4;
      } else if (this.currentPage >= this.totalPages - 1) {
        start = this.totalPages - 3;
      }
      
      // Add "..." if needed
      if (start > 2) {
        pages.push(-1); // -1 represents "..."
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add "..." if needed
      if (end < this.totalPages - 1) {
        pages.push(-2); // -2 represents "..."
      }
      
      // Always include last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }
  
  refreshEvents() {
    this.loadEvents();
  }
  
  onViewDetails(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }
}