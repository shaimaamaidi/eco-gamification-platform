import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit{
  
  public resetPasswordForm!: FormGroup;
  public showPassword = false;
  public showConfirmPassword = false;
  public passwordMismatch = false;
  public passwordStrength = 0;
  public errorMessage = "";
  public errors: { [key: string]: string } = {};
  public isLoading=false;
  public submitButtonCliqued=false;
  private forgetPassword: boolean=true;
  private  mail : string ='';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router:Router, 
    private tokenService : TokenService,
    private authService : AuthService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.forgetPassword = params.get('forgetPassword') === 'true';
      if(this.forgetPassword) {
        this.tokenService.setAccessToken(params.get('token') || '');
        this.mail=this.tokenService.getMail() || '';
      }
    });
    this.mail=this.tokenService.getMail() || '';
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
      },
      {
        validator: this.passwordMatchValidator,
      },
    );
    
    this.resetPasswordForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordStrength = this.calculatePasswordStrength(value);
      this.passwordStrengthValidator(value);
    });
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

  private passwordStrengthValidator(password: string): boolean {
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    if (password.length >= 8) {

      if (!hasUppercase && !hasDigit) {
        this.errorMessage = "Le mot de passe doit contenir au moins une majuscule et un chiffre.";
        return false;
      }

      if (!hasUppercase) {
        this.errorMessage = "Le mot de passe doit contenir au moins une majuscule.";
        return false;
      }

      if (!hasDigit) {
        this.errorMessage = "Le mot de passe doit contenir au moins un chiffre.";
        return false;
      }
    }
    this.errorMessage = "";
    return true;
  }

  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (!password) {
      return strength;
    }
    if(password.length<8) return 0;
    //1 point pour longueur >= 8,1 pour miniscules, 1 pour majuscules, 1 pour chiffres, 1 pour caractères spéciaux, 1
    if (password.length >= 8) 
      strength++;
    if (/[a-z]/.test(password))
      strength++;
    if (/[A-Z]/.test(password)) 
      strength++;
    if (/\d/.test(password)) 
      strength++;
    if (/[\W_]/.test(password)) 
      strength++;

    return strength;
  }

  public get password() {return this.resetPasswordForm.get("password");}
  
  public get confirmPassword() {return this.resetPasswordForm.get("confirmPassword");}

  public togglePassword(): void {this.showPassword = !this.showPassword;}

  public toggleConfirmPassword(): void {this.showConfirmPassword = !this.showConfirmPassword;}

  public onSubmit(): void {
    this.submitButtonCliqued = true;
    this.resetPasswordForm.updateValueAndValidity();

    if(this.password?.errors?.['required'] || this.confirmPassword?.errors?.['required']){
      this.errorMessage = "Merci de renseigner toutes les informations demandées.";
    }

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const passwordValue = this.resetPasswordForm.get('password')?.value;
    if(!this.passwordStrengthValidator(passwordValue)){
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.resetPassword(this.mail,passwordValue).subscribe({
      next: (response) => {
        this.resetPasswordForm.reset();
        this.submitButtonCliqued = false;
        this.toastr.success("Votre mot de passe a été réinitialisé avec succès.", "Succès");
        this.authService.logout();
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }
}
