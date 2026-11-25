import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../services/token/token.service';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.css'
})
export class EmailVerification implements OnInit, OnDestroy {
  public verficationForm!: FormGroup;
  public mail : string | undefined = "";
  public code: string[] = ["", "", "", "", "", ""];
  public isLoading : boolean = false;
  public timeLeft : number = 900; 
  public isResend : boolean = false; 
  private timerInterval: any;

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private router :Router, 
    private tokenService : TokenService, 
    private authService :AuthService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.mail=this.tokenService.getMail();
    if(!this.mail){
      this.toastr.error("Impossible de récupérer votre adresse e-mail. Veuillez contacter notre support à l'adresse support@ecoplateform.com pour assistance.", "Erreur");
      return;
    }
    this.startTimer();
    this.verficationForm = this.fb.group({
      code: this.fb.array(Array(6).fill('').map(() => this.fb.control('')))
    });

  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const storedEndTime = localStorage.getItem('verificationEndTime');
    let endTime: number;

    if (storedEndTime) {
      endTime = Number(storedEndTime);
    } else {
      endTime = Date.now() + 900 * 1000; 
      localStorage.setItem('verificationEndTime', endTime.toString());
    }

    // Calcul initial du temps restant
    this.timeLeft = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      this.timeLeft = Math.max(Math.floor((endTime - now) / 1000), 0);

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        localStorage.removeItem('verificationEndTime');
      }
    }, 1000);
  }


  public formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  public get codeControls(): FormControl[] {
    return (this.verficationForm.get('code') as FormArray).controls as FormControl[];
  }

  public onCodeInputChange(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 1);

    this.codeControls[index].setValue(value, { emitEvent: false });

    if (value && index < this.codeControls.length - 1) {
      const nextInput = this.codeInputs.get(index + 1);
      nextInput?.nativeElement.focus();
    }

    this.updateCode();
  }

  private updateCode() {
    this.code = this.codeControls.map(c => c.value);
  }

  public onKeyDown(index: number, event: KeyboardEvent): void {
    const input = this.codeControls[index].value;

    if (event.key === 'Backspace') {
      if (!input && index > 0) {
        const prevInput = this.codeInputs.get(index - 1);
        prevInput?.nativeElement.focus();
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = this.codeInputs.get(index - 1);
      prevInput?.nativeElement.focus();
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowRight' && index < this.codeControls.length - 1) {
      const nextInput = this.codeInputs.get(index + 1);
      nextInput?.nativeElement.focus();
      event.preventDefault();
      return;
    }
  }

  public onSubmit():void {
    const verificationCode = this.code.join("");
    if (verificationCode.length !== 6) return;

    this.isLoading = true;
    if(this.mail){
      this.authService.verifyUser(this.mail, Number(verificationCode)).subscribe({
        next: (message) => {
          this.isLoading = false;
          localStorage.removeItem('verificationEndTime');
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    }
  }

  public handleResend(): void {
    this.isResend = true;
    const endTime = Date.now() + 3600 * 1000; 
    localStorage.setItem('verificationEndTime', endTime.toString());
    this.startTimer();

    if (this.mail) {
      this.authService.resendVerificationCode(this.mail).subscribe({
        next: () => {
          this.isLoading = false;
          localStorage.removeItem('verificationEndTime');
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    }
  }
}
