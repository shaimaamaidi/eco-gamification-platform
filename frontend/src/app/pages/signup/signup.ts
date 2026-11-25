import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  public signupForm!: FormGroup;
  public showPassword = false;
  public showConfirmPassword = false;
  public isLoading = false;
  public errorMessage = "";
  public submitButtonCliqued=false;

  constructor(private formBuilder: FormBuilder,private router: Router, private authService : AuthService) {}
  
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        city: ['', Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      },
    )
  }

  private passwordMatchValidator (control: AbstractControl): ValidationErrors | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");
    if (!password || !confirmPassword ) {
      return null ;
    }
    if (confirmPassword.value!=='' && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  public get firstName() {return this.signupForm.get("firstName");}

  public get lastName() {return this.signupForm.get("lastName");}

  public get city() {return this.signupForm.get('city');}

  public get email() {return this.signupForm.get("email");}

  public get password() {return this.signupForm.get("password");}

  public get confirmPassword() {return this.signupForm.get("confirmPassword");}

  public togglePassword(): void {this.showPassword = !this.showPassword;}
   
  public toggleConfirmPassword(): void {this.showConfirmPassword = !this.showConfirmPassword;}

  public onSubmit() {
    this.submitButtonCliqued = true;
    this.signupForm.updateValueAndValidity();

    if(this.email?.errors?.['required'] || this.password?.errors?.['required']){
      this.errorMessage="Merci de renseigner toutes les informations demandées."
    }

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;

    const mail = this.email?.value;
    const city = this.city?.value;
    const userName = `${this.firstName?.value} ${this.lastName?.value}`;
    const password = this.password?.value;
    this.authService.register(city, mail, password, userName).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['verification_mail']);
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }
  
  public goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
