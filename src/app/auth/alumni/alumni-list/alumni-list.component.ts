import { Component, OnInit } from '@angular/core';
import { AlumniService, Alumni } from '../../../services/alumni.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LeftNavComponent } from '../../../dashboard/left-nav/left-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Interface for edit form only
interface AlumniEditForm extends Alumni {
  currentCTC?: string;
  expectedCTC?: string;
}

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-alumni-list',
  templateUrl: './alumni-list.component.html',
  styleUrls: ['./alumni-list.component.css']
})
export class AlumniListComponent implements OnInit {
  alumniList: Alumni[] = [];
  filteredAlumniList: Alumni[] = [];
  paginatedAlumniList: Alumni[] = [];
  fileName: string = 'AlumniExcelSheet.xlsx';
  searchTerm: string = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  selectedAlumnus: Alumni = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    skills: '',
    passoutYear: null,
    company: '',
    jobTitle: '',
    experience: '',
    currentCTC: '',
    expectedCTC: '',
    createdAt: new Date()
  };
  newAlumnus: Alumni = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    skills: '',
    passoutYear: null,
    company: '',
    jobTitle: '',
    experience: '',
    createdAt: new Date()
  };


  constructor(private alumniService: AlumniService) { }

  ngOnInit(): void {
    this.loadAlumni();
  }

  loadAlumni() {
    const token = this.alumniService.getAccessToken();
    if (token) {
      this.alumniService.getAlumni('alumni', token).subscribe({
        next: (data: Alumni[]) => {
          this.alumniList = data.map(alumnus => ({
            ...alumnus,
            currentCTC: alumnus.currentCTC || '',
            expectedCTC: alumnus.expectedCTC || '',
            createdAt: new Date(alumnus.createdAt)
          })).sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));
          this.filterAlumni();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching alumni data:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error loading alumni',
            text: 'Unable to load alumni data',
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true
          });
        }
      });
    }
  }
  openEditModal(alumnus: Alumni) {
    this.selectedAlumnus = {
      ...alumnus,
      currentCTC: alumnus.currentCTC || '',
      expectedCTC: alumnus.expectedCTC || ''
    };
    const editModal = document.getElementById('editModal');
    if (editModal) {
      editModal.style.display = 'block';
    }
  }

  addAlumni() {
    // Reset the newAlumnus object
    this.newAlumnus = {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      skills: '',
      passoutYear: null,
      company: '',
      jobTitle: '',
      experience: '',
      currentCTC: '',
      expectedCTC: '',
      createdAt: new Date()
    };

    const addModal = document.getElementById('addModal');
    if (addModal) {
      addModal.style.display = 'block';
    }
  }

  closeAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
      addModal.style.display = 'none';
    }
  }

  submitNewAlumni() {
    this.alumniService.addAlumnus('alumni', this.newAlumnus).subscribe({
      next: (response: Alumni) => {
        Swal.fire({
          icon: 'success',
          title: 'Alumni added successfully!',
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
        });
        this.loadAlumni();
        this.closeAddModal();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error adding alumni:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error while adding alumni',
          text: error.error?.message || 'An unexpected error occurred',
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
        });
      }
    });
  }

  filterAlumni() {
    // Filter alumni by search term
    this.filteredAlumniList = this.alumniList.filter(alumni =>
      alumni.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      alumni.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Update pagination info
    this.totalItems = this.filteredAlumniList.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Reset to first page when filtering
    this.currentPage = 1;

    // Update paginated list
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.paginatedAlumniList = this.filteredAlumniList.slice(startIndex, endIndex);
  }


  getPages(): (number | string)[] {
    // If total pages is 5 or less, show all pages
    if (this.totalPages <= 5) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Add ellipsis if needed
    if (this.currentPage > 3) {
      pages.push('...');
    }

    // Add pages around current page
    for (let i = Math.max(2, this.currentPage - 1);
      i <= Math.min(this.totalPages - 1, this.currentPage + 1);
      i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (this.currentPage < this.totalPages - 2) {
      pages.push('...');
    }

    // Always show last page if there is more than one page
    if (this.totalPages > 1) {
      pages.push(this.totalPages);
    }

    return pages;
  }

  // Updated onPageChange method to handle string | number type
  onPageChange(page: string | number): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }

  closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
      editModal.style.display = 'none';
    }
  }

  updateAlumnus() {
    // Create an object with all fields including CTC
    const updatedData = {
      ...this.selectedAlumnus,
      currentCTC: this.selectedAlumnus.currentCTC?.trim() || '',
      expectedCTC: this.selectedAlumnus.expectedCTC?.trim() || ''
    };

    this.alumniService.updateAlumnus(`alumni/${this.selectedAlumnus._id}`, updatedData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated successfully!',
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
        });
        this.loadAlumni();
        this.closeEditModal();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Update error:', error); // For debugging
        Swal.fire({
          icon: 'error',
          title: 'Error while updating',
          text: error.error?.message || 'An unexpected error occurred',
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
        });
      }
    });
  }


  openDeleteModal(alumnusId: string) {
    this.selectedAlumnus._id = alumnusId;
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
      deleteModal.style.display = 'block';
    }
  }

  closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
      deleteModal.style.display = 'none';
    }
  }

  deleteAlumnus() {
    this.alumniService.deleteAlumnus(`alumni/${this.selectedAlumnus._id}`).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted successfully!',
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
        });
        this.loadAlumni();
        this.closeDeleteModal();
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error while deleting',
          text: error.error?.message || 'An unexpected error occurred',
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
        });
      }
    });
  }

  // Download Report
  export() {
    let table = document.getElementById('excel-table') as HTMLTableElement;
    if (table) {
      let rows = table.rows;
      let data = [];
      for (let i = 0; i < rows.length; i++) {
        let row = [];
        for (let j = 0; j < rows[i].cells.length; j++) {
          row.push(rows[i].cells[j].innerHTML);
        }
        data.push(row);
      }

      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
    }
  }



}
