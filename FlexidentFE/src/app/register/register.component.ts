  import { CommonModule } from '@angular/common';
  import { Component } from '@angular/core';
  import { RouterModule } from '@angular/router';
  import {MatSelectModule} from '@angular/material/select';
  import {MatInputModule} from '@angular/material/input';
  import {MatFormFieldModule} from '@angular/material/form-field';
  import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
  import {MatDatepickerModule} from '@angular/material/datepicker';
  import {MatNativeDateModule} from '@angular/material/core';
  import { MAT_DATE_LOCALE } from '@angular/material/core';
  import { DateAdapter } from '@angular/material/core';
  import {MatDividerModule} from '@angular/material/divider';
  import {MatButtonModule} from '@angular/material/button';
  import {MatIconModule} from '@angular/material/icon';
  import { AbstractControl, FormBuilder, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
  import { HttpClient} from '@angular/common/http';
  import {MatCardModule} from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
  @Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule,MatFormFieldModule, MatInputModule, RouterModule,MatIconModule,
            MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
              MatButtonModule, MatDividerModule, ReactiveFormsModule, FormsModule, MatCardModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
                { provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
                
    ]
  })

  export class RegisterComponent {
    registerForm: FormGroup;

    constructor(private fb: NonNullableFormBuilder, private http: HttpClient, private dateAdapter: DateAdapter<Date>,   private snackBar: MatSnackBar // Add MatSnackBar here
    ) {
      this.dateAdapter.setLocale('en-GB'); // Set locale for date format as dd/MM/yyyy

      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        birthDate: ['', Validators.required]
      }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
    
      return password === confirmPassword ? null : { mismatch: true };
    };
    onSubmit() {
      if (this.registerForm.valid) {
        const formData = {
          email: this.registerForm.value.email,
          username: this.registerForm.value.username,
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          birthDate: new Date(this.registerForm.value.birthDate),
          userRole: this.registerForm.value.role,
          password: this.registerForm.value.password,
          specializare: 10,
          description: "No description yet",
          phone: "-"
        };
    
        this.http.post('https://localhost:7264/register', formData).subscribe({
          next: (response) => {
            console.log('Registration successful', response);
            
            // Show snack bar on success
            this.snackBar.open('Utilizator înregistrat', 'Close', {
              duration: 3000,  // 3 seconds duration
              verticalPosition: 'top',  // Set the position of the snack bar
              horizontalPosition: 'center',  // Centered horizontally
            });
          },
          error: (error) => console.error('There was an error!', error)
        });
      }
    }
    
  }

