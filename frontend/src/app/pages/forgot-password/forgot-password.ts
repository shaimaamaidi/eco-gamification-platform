import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit{
  public forgotForm!: FormGroup;
  public isLoading = false;
  public submitButtonCliqued = false;
  public showText:boolean=false;

  constructor(private fb: FormBuilder,private authService: AuthService) {}

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public get email() {return this.forgotForm.get('email');}

  public onSubmit() {
    this.submitButtonCliqued = true;

    if (this.forgotForm.invalid) {
      return;
    }

    this.isLoading = true;

    const emailValue = this.email?.value;

    this.authService.sendResetMail(emailValue).subscribe({
      next: () => {
        this.isLoading = false;
        this.showText=true;
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }
}
