import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecompenseDto } from '../../services/models';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecompenseService } from '../../services/services-custom/RecompenseService/recompense-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recompense-update-form',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recompense-update-form.html',
  styleUrl: './recompense-update-form.css'
})
export class RecompenseUpdateForm implements OnInit{
  @Input()recompense :RecompenseDto={};
  @Output() close = new EventEmitter<void>();
  @Output() updateRecompense = new EventEmitter<RecompenseDto>();

  public updateRecompenseForm!: FormGroup;
  public submitClicked = false;
  public isLoading = false;

  constructor(private fb: FormBuilder, private recompenseService : RecompenseService, private toastr : ToastrService) {}

  ngOnInit() {
    this.updateRecompenseForm = this.fb.group({
      icon: [null], 
      description: [this.recompense?.description || '', Validators.required],
    }, { validators: this.atLeastOneFieldChangedValidator.bind(this) });
  }

private atLeastOneFieldChangedValidator(formGroup: FormGroup) {
    const icon = formGroup.get('icon')?.value;
    const description = formGroup.get('description')?.value;

    const descriptionChanged = description !== (this.recompense?.description || '');
    const requiredBadgesValue = formGroup.get('requiredBadges')?.value;

    const iconChanged = !!icon;

    if (!descriptionChanged && !iconChanged) {
      return { noChange: true }; 
    }
    return null;
  }

  public get description() { return this.updateRecompenseForm.get('description');}

  public get requiredBadges() {return this.updateRecompenseForm.get('requiredBadges');}
 
  public get icon() {  return this.updateRecompenseForm.get('icon');}

  public onIconFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.updateRecompenseForm.patchValue({
        icon: input.files[0]
      });
      this.updateRecompenseForm.get('icon')?.updateValueAndValidity();
    }
  }

  public onSubmit() {
    this.submitClicked = true;
    if (this.updateRecompenseForm.invalid) {
      return;
    }

    this.isLoading = true;
    const updatedRecompense: RecompenseDto = {};
    const iconValue = this.icon?.value;
    const descriptionValue = this.description?.value;

    if (descriptionValue && descriptionValue !== this.recompense.description) {
      updatedRecompense.description = descriptionValue;
    }
    if (iconValue instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(iconValue);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const extension = iconValue.name.split('.').pop() || '';

        updatedRecompense.icon = base64String;
        updatedRecompense.extension = extension;

        this.sendUpdateRequest(updatedRecompense);
      };
      reader.onerror = (err) => {
        this.isLoading = false;
        this.toastr.error("Erreur lors du traitement de l'image. Veuillez réessayer.", "Erreur");
      };
    } else {
      updatedRecompense.icon=undefined;
      this.sendUpdateRequest(updatedRecompense);
    }
  }

  private sendUpdateRequest(updatedRecompense: RecompenseDto) {
    const idRecompense=this.recompense.id;
    if(idRecompense){
      this.recompenseService.updateRecompense(idRecompense, updatedRecompense).subscribe({
        next: (response) => {
          this.isLoading = false;
          if(updatedRecompense.icon && updatedRecompense.extension){
            this.recompense.icon=updatedRecompense.icon;
            this.recompense.extension=updatedRecompense.extension;
          }
          if(updatedRecompense.description && updatedRecompense.description!=this.recompense.description){
            this.recompense.description=updatedRecompense.description;
          }
          this.updateRecompense.emit(this.recompense);
          this.closeForm();
          this.toastr.success("La récompense est mise à jour avec succès !", "Succès");
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    }else{
      this.toastr.error("Impossible de déterminer la récompense. Veuillez vous reconnecter.", "Erreur");
    }
  }
  
  public closeForm() {
    this.close.emit();
  }
}
