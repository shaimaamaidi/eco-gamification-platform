import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChallengeService } from '../../services/services-custom/ChallengeService/challenge-service';
import { ChallengeDto } from '../../services/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-challenge-form',
  standalone : true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-challenge-form.html',
  styleUrl: './add-challenge-form.css'
})
export class AddChallengeForm  implements OnInit{
  @Output() close = new EventEmitter<void>();
  @Output() reloadData = new EventEmitter<void>();

  public addChallengeForm!: FormGroup;
  public submitClicked = false;
  public isLoading = false; 

  public minDate = new Date().toISOString().split('T')[0];
 
  constructor(private fb: FormBuilder , private challengeService :ChallengeService,private toastr : ToastrService) {}

  ngOnInit(): void {
    this.addChallengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      actionType: ['', Validators.required],
      goal: [null, [Validators.required, Validators.min(0)]],
      icon: [null, Validators.required],
      startDate: ['', [Validators.required, this.minDateValidator.bind(this)]],
      endDate: ['', [Validators.required, this.endDateValidator.bind(this)]],
    });
  }

  private minDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected >= today ? null : { minDate: true };
  }

  private endDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const endDate = new Date(control.value);
    const startDate = new Date(this.addChallengeForm?.get('startDate')?.value);
    endDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    return endDate > startDate ? null : { endBeforeStart: true };
  }

  public get title() { return this.addChallengeForm.get('title'); }
  public get description() { return this.addChallengeForm.get('description'); }
  public get goal() { return this.addChallengeForm.get('goal'); }
  public get icon() { return this.addChallengeForm.get('icon'); }
  public get startDate() { return this.addChallengeForm.get('startDate'); }
  public get endDate() { return this.addChallengeForm.get('endDate'); }
  public get actionType() { return this.addChallengeForm.get('actionType'); }


  public onIconFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.icon?.setValue(input.files[0]);
    } else {
      this.icon?.setValue(null);
    }
  }

  public onSubmit() {
    this.submitClicked = true;
    if (this.addChallengeForm.invalid) return;

    this.isLoading = true;

    const iconFile: File = this.addChallengeForm.get('icon')?.value;

    const reader = new FileReader();
    reader.readAsDataURL(iconFile);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; 
      const extension = iconFile.name.split('.').pop(); 

      const challengeDTO: ChallengeDto = {
        title: this.addChallengeForm.get('title')?.value,
        description: this.addChallengeForm.get('description')?.value,
        actionType: this.addChallengeForm.get('actionType')?.value,
        goal: this.addChallengeForm.get('goal')?.value,
        startDate: this.addChallengeForm.get('startDate')?.value,
        endDate: this.addChallengeForm.get('endDate')?.value,
        icon: base64String,
        extension: extension
      };

      this.challengeService.addChallenge(challengeDTO).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.submitClicked = false;
          this.addChallengeForm.reset();
          this.reloadData.emit();
          this.closeForm();
          this.toastr.success("Le défis est ajouté avec succès", "Succès");
        },
        error: (err) => {
          this.isLoading = false;
          this.submitClicked = false;
        }
      });
    };
    reader.onerror = (error) => {
      this.isLoading = false;
      this.toastr.error("Erreur lors du traitement de l'image. Veuillez réessayer.", 'Erreur');
    };
  }

  public closeForm(): void {
    this.close.emit();
  }
}
