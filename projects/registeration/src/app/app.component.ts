import { RouterOutlet } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RegisterationService } from '../services/registeration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
     CommonModule, // Required for ngIf, ngFor, etc.
     FormsModule,
     ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatListModule,
    MatDividerModule,
    MatCardModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  accountFormGroup!: FormGroup;
  companyFormGroup!: FormGroup;
  packageFormGroup!: FormGroup;
  reviewFormGroup!: FormGroup;

  isCompleted = false;
  currentStep = 1;
  email: any;

    // Variables to control password visibility
    showPassword = false;
    showConfirmPassword = false;

  // Add these properties
  showTermsModal = false;
  showPrivacyModal = false;

  // Add these methods
  openTermsModal() {
    this.showTermsModal = true;
  }

  openPrivacyModal() {
    this.showPrivacyModal = true;
  }

  closeTermsModal() {
    this.showTermsModal = false;
  }

  closePrivacyModal() {
    this.showPrivacyModal = false;
  }

  // Industry dropdown options
  industryOptions = [
    'Healthcare',
    'Technology',
    'Manufacturing',
    'Finance',
    'Education',
    'Retail',
  ];

  
employeeCountOptions: string[] = [
  '1-10',
  '11-50',
  '51-100',
  '101-500',
  '501-1000',
  '1000+'
];

  selectedPackage = 'starter';

  constructor(
    private _formBuilder: FormBuilder,
    private companiesData: RegisterationService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForms();
  }

  initializeForms() {
    this.accountFormGroup = this._formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        // name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        designationName: ['', Validators.required],
        employeeCount: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        companyName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },{ validators: this.passwordMatchValidator}
    );

    this.companyFormGroup = this._formBuilder.group({
      // companyGroup: [''],
      // companyName: [''],
      // companyCode: [''],
      industry: [''],
      dateFormat: ['DD/MM/YYYY'],
      tDateFieldSeperator: ['/'],
      timeformat: ['12-hour'],
      timezone: ['IST (Indian Standard Time, UTC+5:30)'],
      displayFormat: ['Hours:Minutes:Seconds'],
    });

    this.packageFormGroup = this._formBuilder.group({
      package: ['starter', Validators.required],
    });

    this.reviewFormGroup = this._formBuilder.group({
      confirmTerms: [false, Validators.requiredTrue],
    });
  }

  getCurrentDate(): string {
  return new Date().toLocaleDateString();
}

  // Custom validator to check if the passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const Password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    return Password === confirmPassword ? null : { passwordMismatch: true };
  }

    // Method to toggle password visibility
    togglePasswordVisibility(field: string): void {
      if (field === 'current') {
        this.showPassword = !this.showPassword;
      } else if (field === 'confirm') {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    }

  selectPackage(packageType: string) {
    this.selectedPackage = packageType;
    this.packageFormGroup.get('package')?.setValue(packageType);
  }

  getStepState(step: number): string {
    if (this.isCompleted) {
      return 'done';
    }

    // Current step is in edit mode
    if (step === this.currentStep) {
      return 'edit';
    }

    // Previous steps are completed
    if (step < this.currentStep) {
      return 'done';
    }

    // Future steps are not yet active
    return 'number';
  }

 generateCompanyCode(companyName:string) {
  if (typeof companyName !== 'string' || companyName.length < 2) {
    throw new Error('Company name must be at least 2 characters long');
  }
  const prefix = companyName.slice(0, 2).toUpperCase();
  // Generate random number between 1 and 999 inclusive
  const randomNumber = Math.floor(Math.random() * 999) + 1
  // Pad number with leading zeros to 3 digits
  const numberStr = randomNumber.toString().padStart(3, '0');
  return prefix + numberStr;

}

  sendCompaniesData = (data: any, companyName:string) => {
    const formValues = { ...data };
    // console.log('form values', formValues);
    const company: any = {
      id: uuidv4(),
      companyGroupName: companyName,
      email: this.email,
      companyId: uuidv4(),
      companyName: companyName,
      companyCode: this.generateCompanyCode(companyName),
      industry: formValues.industry,
      dateFormat: formValues.dateFormat,
      dateFieldSeperator: formValues.tDateFieldSeperator,
      timeformat: formValues.timeformat,
      timeDisplayFormat: formValues.displayFormat?.trim().substring(0, 20), // Ensure max length is 20
      timezone: formValues.timezone,
      // scheam: "tenant_" + (companyName &&
      // companyName.length >= 4
      //   ? (
      //       companyName.charAt(0) +
      //       companyName.charAt(1) +
      //       companyName.slice(-2)
      //     ).toLowerCase()
      //   : 'dbo'),
      scheam: 'dbo',
      status: 1,
    };
    console.log('form values', company);
    this.companiesData
      .postCompany('api/Account/CreatCompanyRegitration', company)
      .subscribe({
        next: (dataSent) => {
          console.log('data sent:', dataSent);
          if (dataSent === null) {
            this.openSnackBar('Saved Successfully', 'Okay', 'green-snackbar');
            localStorage.setItem('dateSeparator', JSON.stringify(company));
            localStorage.setItem('tenantSchema', company.scheam);
          }
          this.currentStep++;
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }

          this.openSnackBar(errorMessage, 'Close', 'red-snackbar');
        },
      });
  };
  
  nextStep() {
    // Validate current step before proceeding
    switch (this.currentStep) {
      case 1:
        if (this.accountFormGroup.valid) {
          console.log('Checking case 1');
          console.log(this.accountFormGroup.value);
          //Function to post data
          // this.saveData(this.accountFormGroup.value);
          this.email = this.accountFormGroup.value.email;
          this.currentStep++;
        }
        break;
      case 2:
        if (this.companyFormGroup.valid) {
          console.log('Checking case 2');
          console.log(this.companyFormGroup.value);
          // this.sendCompaniesData(this.companyFormGroup.value);
          this.currentStep++;
        }
        break;
      // case 3:
      //   if (this.packageFormGroup.valid) {
      //     this.currentStep++;
      //   }
      //   break;
      default:
        break;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async onSubmit() {
    if (
      this.accountFormGroup.valid &&
      this.companyFormGroup.valid &&
      this.packageFormGroup.valid &&
      this.reviewFormGroup.valid
    ) {
      // Call saveData and proceed to sendCompaniesData only after successful completion
      this.companiesData
        .registerUser('api/Account/Register', {
          firstName: this.accountFormGroup.value.firstName,
          lastName: this.accountFormGroup.value.lastName,
          // tenantSchema: "tenant_" +
          //   (this.accountFormGroup.value.companyName &&
          //   this.accountFormGroup.value.companyName.length >= 4
          //     ? (
          //         this.accountFormGroup.value.companyName.charAt(0) +
          //         this.accountFormGroup.value.companyName.charAt(1) +
          //         this.accountFormGroup.value.companyName.slice(-2)
          //       ).toLowerCase()
          //     : 'dbo'),
          tenantSchema: 'dbo',
          email: this.accountFormGroup.value.email,
          password: this.accountFormGroup.value.password,
          confirmPassword: this.accountFormGroup.value.confirmPassword,
        })
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            // alert('Registration successful!');
                     this.openSnackBar('Registration Successfull', 'Close', 'green-snackbar');
            // Only after successful registration, send the company data
            const companyName = this.accountFormGroup.value.companyName;
            this.sendCompaniesData(this.companyFormGroup.value, companyName);
            this.isCompleted = true;
            console.log('Navigating to dashboard');
            console.log("Company registeration completed suceessfully");
            this.openSnackBar('Company registration completed successfully', 'Close', 'green-snackbar');
            // this.router.navigate(['/authentication/login']);
          },
          error: (error) => {
            console.error('Registration error:', error);
            this.openSnackBar('Registration failed', 'Close', 'red-snackbar');
            // Do not proceed with company data if registration fails
          },
        });
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 1500,
      verticalPosition: 'bottom',
      panelClass: [className],
    });
  }

    // Helper method to check if passwords match (for template usage)
    get passwordsMatch(): boolean {
      return !this.accountFormGroup.hasError('passwordMismatch');
    }
}
