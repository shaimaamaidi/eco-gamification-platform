import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChallengeDto } from '../../services/models';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChallengeService } from '../../services/services-custom/ChallengeService/challenge-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-challenge-update-form',
  standalone : true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './challenge-update-form.html',
  styleUrl: './challenge-update-form.css'
})
export class ChallengeUpdateForm implements OnInit{
  @Input() challenge :ChallengeDto={};
  @Output() close = new EventEmitter<void>();
  @Output() challengeUpdated = new EventEmitter<ChallengeDto>();

  public minDate = new Date().toISOString().split('T')[0];
  public isLoading : boolean =false;
  public submitClicked : boolean =false;
  public updateChallengeForm!: FormGroup;

  constructor(private fb: FormBuilder, private challengeService : ChallengeService,private toastr : ToastrService) {}

  ngOnInit() {
      this.updateChallengeForm = this.fb.group({
      icon: [null],  
      description: [this.challenge?.description || '', Validators.required], 
      endDate: [this.challenge?.endDate || '', Validators.required]
    }, { validators: this.atLeastOneFieldChangedValidator.bind(this) });
  }

  private atLeastOneFieldChangedValidator(formGroup: FormGroup) {
    const icon = formGroup.get('icon')?.value;
    const description = formGroup.get('description')?.value;
    const endDate = formGroup.get('endDate')?.value;

    const iconChanged = !!icon; 
    const descriptionChanged = description !== (this.challenge.description || '');
    const endDateChanged = endDate !== (this.challenge.endDate || '');

    if (!iconChanged && !descriptionChanged && !endDateChanged) {
      return { noChange: true };
    }
    if (endDateChanged) {
      const minDateError = this.minDateValidator(formGroup.get('endDate')!);
      if (minDateError) {
        return { invalidDate: true };
      }
    }
    if (iconChanged && !icon) {
      return { invalidIcon: true };
    }
    return null;
  }


  public onIconFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.updateChallengeForm.patchValue({ icon: file });
      this.updateChallengeForm.get('icon')?.updateValueAndValidity();
    }
  }

  private minDateValidator(control: AbstractControl) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { minDate: true };
  } 

  public get icon() {return this.updateChallengeForm.get('icon');}
  public get endDate() {return this.updateChallengeForm.get('endDate');}
  public get description() {return this.updateChallengeForm.get('description');}

  public closeForm() {this.close.emit();}

  public onSubmit() {
    this.submitClicked = true;

    if (this.updateChallengeForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updatedChallenge: ChallengeDto = {};

    const iconValue = this.icon?.value;
    const descriptionValue = this.description?.value;
    const endDate=this.endDate?.value;

    if (descriptionValue && descriptionValue !== this.challenge.description) {
      updatedChallenge.description = descriptionValue;
    }

    if(endDate && endDate!==this.challenge.endDate){
      updatedChallenge.endDate=endDate;
    }

    if (iconValue instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(iconValue);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const extension = iconValue.name.split('.').pop() || '';

        updatedChallenge.icon = base64String;
        updatedChallenge.extension = extension;

        this.sendUpdateRequest(updatedChallenge);
      };
      reader.onerror = (err) => {
        this.isLoading = false;
        this.toastr.error("Erreur lors du traitement de l'image. Veuillez réessayer.", "Erreur");
      };
    } else {
      updatedChallenge.icon=undefined;
      updatedChallenge.extension=undefined;
      this.sendUpdateRequest(updatedChallenge);
    }
  }

  private sendUpdateRequest(updatedChallenge: ChallengeDto) {
    if(this.challenge.id){
      this.challengeService.updateChallenge(this.challenge.id, updatedChallenge).subscribe({
        next: (response) => {
          this.isLoading = false;
          if(updatedChallenge.icon && updatedChallenge.extension){
            this.challenge.icon=updatedChallenge.icon;
            this.challenge.extension=updatedChallenge.extension;
          }

          if(updatedChallenge.description && updatedChallenge.description!==this.challenge.description){
            this.challenge.description=updatedChallenge.description;
          }

          if(updatedChallenge.endDate && updatedChallenge.endDate!==this.challenge.endDate){
            this.challenge.endDate=updatedChallenge.endDate;
          }
          this.challengeUpdated.emit(this.challenge);
          this.closeForm();
          this.toastr.success("Le défis est mis à jour avec succès !", "Succès");
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    }else{
      this.toastr.error("Impossible de déterminer le défis. Veuillez vous reconnecter.", "Erreur");
    }
  }
}
