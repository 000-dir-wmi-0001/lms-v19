import { Batch } from '../../services/batch.service';
import { BatchService } from './../../services/batch.service';
import { Component, OnInit, TemplateRef, PipeTransform } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../../services/user.service';
import * as XLSX from 'xlsx';
import { CommonModule, Location } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { StudentNotificationService } from '../../services/student-notification.service';
import { FollowUp, FollowUpService } from '../../services/follow-up.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admission',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgMultiSelectDropDownModule, RouterLink],
  templateUrl: './admission.component.html',
  styleUrl: './admission.component.css'
})
export class AdmissionComponent implements OnInit, PipeTransform {
  totalmodulefee: any; // Total fee for selected modules
  installmentsFromAdmin: any = 0; // Installments from admin
  selectedStudent!: {
    _id: string;
    name: string;
    email: string;
    admissionDate: Date;
    batchId?: string;
  };

  // Handle item selection from dropdown
  onItemSelect(item: any) {
    const selectedItem = this.dropdownList.find((i) => i._id === item._id); // Find selected item
    if (selectedItem && selectedItem.price !== undefined) {
      this.selectedItems.push(selectedItem); // Add selected item to the list
      const previousTotal = this.totalmodulefee || 0; // Get previous total
      const newItemPrice = selectedItem.price; // Get new item price
      this.totalmodulefee = previousTotal + newItemPrice; // Add new item price to previous total

      console.log(
        `Previous total: ${previousTotal}, New item price: ${newItemPrice}, New total: ${this.totalmodulefee}`
      );
    }
    this.updateInstallmentsAllowedState(); // Update installments allowed state
    console.log(this.selectedItems, 'selected ones');
  }

  // Handle item deselection from dropdown
  onDeSelect(item: any) {
    const deselectedItemIndex = this.selectedItems.findIndex(
      (i) => i._id === item._id
    );

    if (deselectedItemIndex !== -1) {
      const deselectedItem = this.selectedItems[deselectedItemIndex];

      this.totalmodulefee -= deselectedItem.price;
      this.selectedItems.splice(deselectedItemIndex, 1); // Remove item by index

      console.log(
        `Deselected item price: ${deselectedItem.price}, New total: ${this.totalmodulefee}`
      );
    } else {
      console.log('Item not found during deselection.');
    }

    this.updateInstallmentsAllowedState();
    console.log(this.selectedItems, 'Selected after deselect');
  }

  // Handle selection of all items in dropdown
  onSelectAll(items: any) {
    this.selectedItems = items
      .map((item: any) => {
        return this.dropdownList.find((i) => i._id === item._id); // Map selected items
      })
      .filter((item: undefined) => item !== undefined); // Filter out undefined items
    this.totalmodulefee = this.selectedItems.reduce(
      (sum, item) => sum + item.price,
      0
    ); // Update total fee
    console.log(this.totalmodulefee);
    this.updateInstallmentsAllowedState(); // Update installments allowed state
    console.log(this.selectedItems, 'selected all once');
  }
  updateInstallmentsAllowedState() {
    this.userForm.patchValue({
      totalFees: this.totalmodulefee,
      moduleIds: this.selectedItems.map((item) => item._id),
    });
  }

  // Handle deselection of all items in dropdown
  onAllUnselect(items: any) {
    this.selectedItems = []; // Clear selected items
    this.totalmodulefee = 0; // Reset total fee
    console.log(this.totalmodulefee);
    this.updateInstallmentsAllowedState(); // Update installments allowed state
    console.log(this.selectedItems, 'all selected after unselect all');
  }

  selectedStatus = 'all'; // Current selected status
  isLoading = true; // Loading state
  Status = 'all'; // Status filter
  activeTab: string = 'personal'; // Active tab
  bsModalRef!: BsModalRef; // Modal reference
  studentData!: any; // Student data
  academicData: any; // Academic data
  user!: any; // User data
  fileName: string = 'EnquiryExcelSheetLinkcodeLMS.xlsx'; // File name for export
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page for pagination
  editMode: boolean = false; // Edit mode state
  userForm!: FormGroup; // Form for user data
  fromDate!: string; // Start date for filtering
  toDate!: string; // End date for filtering
  _id: any; // User ID
  firstName: any; // User first name
  lastName: any; // User last name
  email: any; // User email
  dob: any; // User date of birth
  mobileno!: Number; // User mobile number
  parentsmobileno: any; // Parent's mobile number
  status: any; // User status
  editStatus: any;
  batchno: any; // Batch number
  admissiondate: any; // Admission date
  searchText!: string; // Search text for enquiries
  currentPath!: string; // Current path for navigation
  staticCourses!: any[]; // Static courses list
  courses!: any[]; // Courses list
  dropdownList!: any[]; // Dropdown list for courses
  selectedItems: any[] = []; // Selected items from dropdown
  dropdownSettings = {}; // Dropdown settings
  selected = []; // Selected items
  followUpdate: Date | null = null; // Follow-up date
  description: string = ''; // Follow-up description
  showFullEmail: boolean = false; // Flag to show full email

  // Log selected items
  getSelectedValue() {
    console.log(this.selectedItems);
  }

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private location: Location,
    private notification: StudentNotificationService,
    private courseService: CourseService,
    private followUpservice: FollowUpService,
    private batchService: BatchService
  ) { }

  // Transform method (not implemented)
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.currentPath = this.location.path(); // Get current path
    this.userForm = this.fb.group({
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: [''],
      mobileno: ['', Validators.required],
      parentsmobileno: [''],
      selectedItems: [''],
      status: [''],
      batchno: [''],
      admissiondate: [''],
      followUpdate: [''],
      courses: [''],
      installmentsAllowed: [
        { value: '', disabled: this.selectedItems.length === 0 },
      ],
    });

    if (this.user) {
      this.patchFormData(this.user);
    }

    this.getDetails(); // Fetch student details
    this.getStaticCourses(); // Fetch static courses
    this.selectedItems = []; // Initialize selected item
    this.getSpecific();
    // Dropdown settings
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.getAllBatches();
  }

  patchFormData(user: any) {
    this.userForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      mobileno: user.mobileno || '',
      parentsmobileno: user.parentsmobileno || '',
      dob: user.dob || '',
      status: user.status || '',
      admissiondate: user.admissiondate || '',
      batchno: user.batchno || '',
      followUpdate: user.followUpdate || '',
      courses: user.courses || [],
    });
  }

  // Toggle edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  // Filter records based on selected status
  filterRecords() {
    if (this.selectedStatus == 'all') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) => record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.selectedStatus == 'true') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) =>
              record.isVerified == true && record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.selectedStatus == 'false') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) =>
              record.isVerified == false && record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  // Get range for pagination
  getRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage; // Calculate start index
    let end = start + this.itemsPerPage; // Calculate end index
    if (end > this.studentData.length) {
      end = this.studentData.length; // Adjust end index if it exceeds total length
    }
    return { start, end }; // Return range
  }

  // Set current page for pagination
  setPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  // Get total number of pages for pagination
  getTotalPages() {
    return Math.ceil((this.studentData?.length || 0) / this.itemsPerPage);
  }

  // Get an array of page numbers for pagination
  getPages() {
    return Array.from({ length: this.getTotalPages() || 0 }, (_, i) => i + 1);
  }


  // Handle page change event
  onPageChange(event: any): void {
    const startIndex = (event.page - 1) * this.itemsPerPage; // Calculate start index
    const endIndex = startIndex + this.itemsPerPage; // Calculate end index
    this.studentData = this.studentData.slice(startIndex, endIndex); // Update student data for current page
  }

  // Filter students based on status
  Statusfilter() {
    if (this.Status == 'all') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) => record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.Status == 'Nurture') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) =>
              record.status == 'Nurture' && record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.Status == 'Enrolled') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) =>
              record.status == 'Enrolled' && record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.Status == 'Prospect') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) =>
              record.status == 'Prospect' && record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.Status == 'Follow Up') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) =>
              record.status == 'Follow Up' && record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.Status == 'Closed') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter(
            (record: any) =>
              record.status == 'Closed' && record.type == 'STUDENT'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  updateEditStatus(id: any, status: 'approved' | 'rejected') {
    this.userService.updateProfileEditStatus(id, status).subscribe({
      next: (res: any) => {
        const userIndex = this.studentData.findIndex((user: any) => user._id === id);
        if (userIndex !== -1) {
          this.studentData[userIndex].editStatus = status;
        }
        alert(`User edit status has been ${status}.`);
      },
      error: (err) => {
        console.error('Error updating edit status:', err);
        alert('An error occurred while updating the status.');
      },

    })
  }

  // Filter students by admission date
  filterByDate() {
    this.studentData = this.studentData.filter((record: any) => {
      const admissionDate = new Date(record.admissiondate); // Parse admission date
      const fromDate = new Date(this.fromDate); // Parse from date
      const toDate = new Date(this.toDate); // Parse to date
      return admissionDate >= fromDate; // Return true if admission date is within range
    });
  }

  // Search for enquiries based on search text
  searchEnquiries() {
    if (!this.searchText) {
      this.getDetails(); // Fetch all details if search text is empty
    } else {
      console.log(this.searchText);
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.studentData = result.filter((record: any) => {
            const fullName = `${record.firstName} ${record.lastName}`; // Construct full name
            const mobileNo = record.mobileno; // Get mobile number
            return (
              (fullName &&
                fullName
                  .toLowerCase()
                  .includes(this.searchText.toLowerCase())) || // Check if full name includes search text
              (mobileNo && mobileNo.toString().includes(this.searchText)) // Check if mobile number includes search text
            );
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  // Update status of a single enquiry
  Statusselect(singleEnquiry: any, event: Event) {
    const target = event.target as HTMLSelectElement; // Get target element
    const selectedValue = target.value; // Get selected value
    singleEnquiry.status = selectedValue; // Update enquiry status
    const id = singleEnquiry._id; // Get enquiry ID
    const statusToUpdate = {
      _id: id,
      status: selectedValue,
    };
    console.log(selectedValue);
    this.userService.updateStatus(statusToUpdate); // Update status in the service
  }

  // Cancel edit mode
  cancelEdit() {
    this.editMode = false;
  }

  // Enable edit mode
  edit() {
    this.editMode = true;
  }

  // Update the state of installments allowed based on selected items
  // Save user data and selected modules
  save() {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.value, this._id).subscribe(
        (result) => {
          console.log(
            this.totalmodulefee,
            this.userForm.value.installmentsAllowed,
            'save called'
          );
          this.totalmodulefee = 0; // Reset total module fee
          this.userForm.patchValue({ installmentsAllowed: 0 }); // Reset installments allowed
          this.selectedItems = []; // Clear selected items
          this.getSpecific(this._id); // Fetch specific user details
          this.editMode = false; // Exit edit mode
          this.getDetails(); // Refresh student details
          this.getStaticCourses(); // Refresh static courses
        },
        (error) => {
          console.log(error);
          this.editMode = false; // Exit edit mode on error
        }
      );

      let data = {
        moduleIds: this.selectedItems.map((module) => module._id), // Get selected module IDs
        totalFees: this.totalmodulefee, // Total fees
        installmentsAllowed: this.userForm.value.installmentsAllowed, // Installments allowed
      };
      console.log(data, 'reqbody');
      this.userService.addModulesfromAdmin(this._id, data).subscribe({
        next: (res: any) => {
          console.log(res, 'response from api for adding modules'); // Log response
          this.getSpecific(this._id);
        },
        error: (error: any) => {
          console.log(error, 'error'); // Log error
        },
      });
      this.sendNotification(this._id, this.selectedItems); // Send notification
    }
  }

  // Send notification after saving modules
  sendNotification(user: any, courses: any) {
    console.log('id: ' + user);
    const array = [];
    array.push(
      courses.map((course: any) => {
        return course.name; // Get course names
      })
    );
    const message =
      'Courses ' + array.toString() + ' have been added \nPay the Fees'; // Construct message
    console.log(message);
    this.notification.saveNotification(user, message).subscribe({
      next: (response: any) => {
        console.log(response); // Log response
      },
      error: (err: any) => {
        console.log(err); // Log error
      },
    });
  }

  // Fetch student details
  getDetails() {
    this.userService.getUsers().subscribe(
      (result: any) => {
        this.studentData = result.filter(
          (record: any) => record.type == 'STUDENT'
        ); // Filter student records
        console.log(this.studentData);
        this.isLoading = false; // Set loading state to false
      },
      (error) => {
        console.log(error); // Log error
      }
    );
  }

  // Fetch static courses
  getStaticCourses(): void {
    this.userService.getALlStaticCourses().subscribe({
      next: (data: any) => {
        this.staticCourses = data; // Set static courses
      },
      error: (err: any) => {
        console.log('error', err); // Log error
      },
    });
  }

  // Cancel modal
  cancel() {
    this.bsModalRef.hide(); // Hide modal
  }

  // Open modal for user
  openModal(template: TemplateRef<any>, id: any) {
    this.userService.getAvailableModulesofUserforPaymentModule(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dropdownList = res.coursesNotEnrolledYet; // Set dropdown list
      },
      error: (err: any) => {
        console.log(err, 'error'); // Log error
      },
    });

    this.getSpecific(id); // Fetch specific user details
    this.getSpecificStudent(id);
    this.bsModalRef = this.modalService.show(template); // Show modal
  }

  // Update verification status of user
  onStatusChange(id: any, status: boolean) {
    this.userService.updateIsVerified(status, id).subscribe(
      (result: any) => {
        this.user.isVerified = status; // Update user verification status
        this.getDetails(); // Refresh student details
      },
      (error: any) => {
        console.log(error); // Log error
      }
    );
  }

  // Fetch specific user details
  getSpecific(id: any = this._id) {
    this.userService.getUser(id).subscribe({
      next: (result: any) => {
        this.user = result.user; // Set user data
        console.log('Fetched user data:', this.user);
        this._id = this.user._id;
        this.firstName = this.user.firstName;
        this.lastName = this.user.lastName;
        this.email = this.user.email;
        this.dob = this.user.dob;
        this.mobileno = this.user.mobileno;
        this.parentsmobileno = this.user.parentsmobileno;
        this.status = this.user.status;
        this.batchno = this.getSelectedBatchNumbers();
        this.admissiondate = this.user.admissiondate;

        console.log('Second API call initiated...');

        // Fetch courses if user has any
        if (this.user.courses && this.user.courses.length > 0) {
          const courseIds = this.user.courses.join(','); // Convert to comma-separated string
          this.courseService.getUserCourses(courseIds).subscribe({
            next: (res: any) => {
              console.log('Course API Response:', res);
              this.courses = res.courses || []; // Fetch courses array from response
              console.log(this.courses, 'courses array');
            },
            error: (error: any) => {
              console.log('Error fetching courses:', error);
            },
          });
        } else {
          console.log('No courses available for this user.');
          this.courses = []; // Clear courses if none
        }

        console.log('User form patched');
        this.userForm.patchValue({
          _id: this.user._id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          dob: this.user.dob,
          mobileno: this.user.mobileno,
          parentsmobileno: this.user.parentsmobileno,
          status: this.user.status,
          batchno: this.getSelectedBatchNumbers(),
          admissiondate: this.user.admissiondate,
          courses: this.user.courses,
        });
      },
      error: (error) => {
        console.log('Error fetching user:', error);
      },
    });
  }


  // Fetch academic information for user
  getAcademicInfo(id: any) {
    this.userService.getStudentAcademicDetails(id).subscribe(
      (result: any) => {
        this.academicData = result; // Set academic data
      },
      (error) => {
        console.log(error); // Log error
      }
    );
  }

  // Add static courses (not implemented)
  AddStaticCourses(): void {
    console.log(
      typeof this.user?.courses,
      this.user?.courses.name,
      'user courses found'
    );
    this.dropdownList = this.user?.courses.name; // Set dropdown list
    console.log(this.dropdownList, 'dropdownlist');
  }

  // Remove course (not implemented)
  RemoveCourse(): void { }

  // Export data to Excel
  export() {
    let table = document.getElementById('excel-table') as HTMLTableElement; // Get table element
    if (table) {
      let rows = table.rows; // Get table rows
      let data = [];
      for (let i = 0; i < rows.length; i++) {
        let row = [];
        for (let j = 0; j < rows[i].cells.length; j++) {
          row.push(rows[i].cells[j].innerHTML); // Get cell data
        }
        data.push(row); // Add row data to array
      }

      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data); // Create worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new(); // Create workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); // Append worksheet to workbook
      XLSX.writeFile(wb, this.fileName); // Write file
    } else {
      console.error('Table not found'); // Log error if table not found
    }
  }

  // Save changes (not implemented)
  saveChanges() {
    this.save();
  }

  // Save follow-up data
  saveFollowUp(): void {
    // Ensure both date and description are provided
    if (!this.followUpdate || !this.description.trim()) {
      alert('Please select a date and enter a description.'); // Alert if fields are empty
      return;
    }

    let followUpDate: Date;
    if (this.followUpdate instanceof Date) {
      followUpDate = this.followUpdate; // Use existing date
    } else {
      followUpDate = new Date(this.followUpdate); // Parse date
    }

    // Validate date
    if (isNaN(followUpDate.getTime())) {
      alert('Invalid date selected.'); // Alert if date is invalid
      return;
    }

    // Prepare follow-up data
    const followUpData: FollowUp = {
      date: followUpDate.toISOString().split('T')[0], // Save as YYYY-MM-DD
      description: this.description,
      studentName: `${this.firstName} ${this.lastName}`.trim(), // Construct student name
      mobileNo: this.mobileno, // Get mobile number
    };

    console.log('followupdata ', followUpData);

    // Send data to the service
    this.followUpservice.saveFollowUp(followUpData).subscribe({
      next: (res: any) => {
        alert('Follow-up saved!'); // Alert on success
        // Reset fields
        this.followUpdate = null; // Reset follow-up date
        this.description = ''; // Clear description
      },
      error: (err: any) => {
        console.error('Error:', err); // Log full error for debugging
        if (err.status === 400) {
          alert(
            'Failed to save follow-up. Please check your input and try again.'
          ); // Alert on validation error
        } else {
          alert('An unexpected error occurred. Please try again.'); // Alert on unexpected error
        }
      },
    });
  }

  filteredBatches: { name: string }[] = []; // Filtered batches based on the search query
  batches: Batch[] = [];
  selectedBatches: Batch[] = [];
  // Fetch all batches
  getAllBatches() {
    this.batchService.getBatches('batches/list').subscribe({
      next: (data: Batch[]) => {
        console.log('Fetched Batches:', data); // Log the response here
        if (data && data.length > 0) {
          this.batches = data; // Store the fetched batches
        } else {
          console.warn('No batches received from the server.');
          this.batches = [];
        }
      },
      error: (error) => {
        console.error('Error fetching batches:', error);
        this.batches = [];
      },
    });
  }
  // Search batches by name
  searchBatch(): void {
    const searchText = this.searchText?.trim().toLowerCase() || '';

    if (!searchText) {
      // If searchText is empty, reset to all batches
      this.filteredBatches = [];
      return;
    }
    // Filter batches by name based on the search text
    this.filteredBatches = this.batches.filter((batch) =>
      batch.name.toLowerCase().includes(searchText)
    );
  }

  // When a batch is clicked, set it as the selected batch
  selectBatch(batch: Batch): void {
    // Check if the batch is already selected to avoid duplicate
    if (!this.selectedBatches.some((b) => b._id === batch._id)) {
      this.selectedBatches.push(batch); // Add selected batch to the array
    }
    // Get the current student ID from the modal
    if (this.user?._id) {
      // First get specific student details
      this.getSpecificStudent(this.user._id);

      // Then add student to the selected batch
      if (batch._id && this.user._id) {
        this.batchService
          .addStudentToBatch(batch._id, this.user._id)
          .subscribe({
            next: (response: any) => {
              console.log('Student successfully added to batch:', response);
              alert(`Student has been added to batch ${batch.name}`);
              this.filteredBatches = []; // Clear the batch list
              this.getSpecific(this.user._id); // Refresh student details
            },
            error: (err: any) => {
              console.error('Error adding student to batch:', err);
              alert('Failed to add student to batch');
            },
          });
      } else {
        console.error('Batch ID or User ID is undefined.');
      }
    } else {
      console.error('No student selected');
    }
  }

  // Method to fetch a specific student
  getSpecificStudent(id: string): void {
    this.userService.getSpecificStudent(id).subscribe({
      next: (student: {
        _id: string;
        name: string;
        email: string;
        admissionDate: Date;
      }) => {
        this.selectedStudent = student; // Automatically set the student
        console.log('Selected student:', this.selectedStudent);
      },
      error: (err: any) => {
        console.error('Error fetching specific student:', err);
      },
    });
  }

  // Method to add the selected student to the selected batch
  addStudent(batchId: string): void {
    if (!this.selectedStudent) {
      console.error('No student selected.');
      return;
    }

    this.batchService
      .addStudentToBatch(batchId, this.selectedStudent._id)
      .subscribe({
        next: (response: any) => {
          console.log('Student successfully added to batch:', response);
          alert(
            `${this.selectedStudent.name} has been added to the selected batch.`
          );
        },
        error: (err: any) => {
          console.error('Error adding student to batch:', err);
        },
      });
  }
  getSelectedBatchNumbers(): string {
    return this.selectedBatches.map((batch) => batch.name).join(', '); // Join batch names with commas
  }

  removeStudent(studentId: string, batchId: string): void {
    this.batchService.removeStudentFromBatch(studentId, batchId).subscribe({
      next: (response: any) => {
        console.log('Response from service:', response);
        alert(`Student has been removed from batch with ID: ${batchId}`);

        // Remove the batch from selectedBatches using batchId
        this.selectedBatches = this.selectedBatches.filter(
          (b) => b._id !== batchId
        );

        // Log the updated selected batches
        console.log(
          'Updated selected batches:',
          this.getSelectedBatchNumbers()
        );
      },
      error: (err: any) => {
        console.error('Error removing student from batch:', err);
        alert('Failed to remove student from batch');
      },
    });
  }
}
