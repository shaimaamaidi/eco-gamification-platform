import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  public loginForm!: FormGroup;
  public showPassword = false;
  public isLoading = false;
  public errorMessage = "";
  public submitButtonCliqued=false;

  constructor( private formBuilder: FormBuilder,private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    })
  }

  public get email() {return this.loginForm.get("email");}
  
  public get password() {return this.loginForm.get("password");}

  public togglePassword(): void {this.showPassword = !this.showPassword;}

  public onSubmit() {
    this.submitButtonCliqued=true;
    this.loginForm.updateValueAndValidity();

    if(this.email?.errors?.['required'] || this.password?.errors?.['required']){
      this.errorMessage="Merci de renseigner toutes les informations demandées."
    }
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return
    }
    this.isLoading = true;
    this.errorMessage = "";

    this.authService.login(this.email?.value,this.password?.value).subscribe({
      next : (res)=>{
        this.isLoading = false;
        if (this.authService.getRole() === 'ADMIN') {
          this.router.navigate(['/main/admin/dashboard']);
        } else {
            this.router.navigate(['/main/dashboard']);
        }
      },
      error : (err)=>{
        this.isLoading = false;
      }
    });  
  }
  
  public goToSignUp(): void {
    this.router.navigate(['/signup']);
  }

}
