  import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BadgeDto } from '../../services/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BadgeService } from '../../services/services-custom/BadgeService/badge-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-badge-update-form',
  standalone : true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './badge-update-form.html',
  styleUrl: './badge-update-form.css'
})
export class BadgeUpdateForm implements OnInit{
  @Input()badge :BadgeDto={};
  @Output() close = new EventEmitter<void>();
  @Output() badgeUpdated = new EventEmitter<BadgeDto>();
  
  public isLoading : boolean =false;
  public submitClicked : boolean =false;
  public updateBadgeForm!: FormGroup;

  constructor(private fb: FormBuilder,private badgeService : BadgeService,private toastr : ToastrService) {}

  ngOnInit() {
    this.updateBadgeForm = this.fb.group({
      icon: [null], 
      description: [this.badge?.description || '', Validators.required]
    }, { validators: this.atLeastOneFieldChangedValidator.bind(this) });
  }

  private atLeastOneFieldChangedValidator(formGroup: FormGroup) {
    const icon = formGroup.get('icon')?.value;
    const description = formGroup.get('description')?.value;

    const descriptionChanged = description !== (this.badge?.description || '');

    const iconChanged = !!icon;

    if (!descriptionChanged && !iconChanged) {
      return { noChange: true }; 
    }
    return null;
  }

  public onIconFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.updateBadgeForm.patchValue({ icon: file });
      this.updateBadgeForm.get('icon')?.updateValueAndValidity();
    }
  }

  public get icon() {return this.updateBadgeForm.get('icon');}

  public get description() {return this.updateBadgeForm.get('description');}

  public closeForm() {this.close.emit();}

  public onSubmit() {
    this.submitClicked = true;

    if (this.updateBadgeForm.invalid) {
      return;
    } 

    this.isLoading = true;
    const updatedBadge: BadgeDto = {};

    const iconValue = this.icon?.value;
    const descriptionValue = this.description?.value;

    if (descriptionValue && descriptionValue !== this.badge.description) {
      updatedBadge.description = descriptionValue;
    }

    if (iconValue instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(iconValue);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const extension = iconValue.name.split('.').pop() || '';

        updatedBadge.icon = base64String;
        updatedBadge.extension = extension;

        this.sendUpdateRequest(updatedBadge);
      };
      reader.onerror = (err) => {
        this.isLoading = false;
        this.toastr.error("Erreur lors du traitement de l'image. Veuillez réessayer.", "Erreur");
      };
    } else {
      this.sendUpdateRequest(updatedBadge);
    }
  }

  private sendUpdateRequest(updatedBadge: BadgeDto) {
    if(this.badge.id){
      this.badgeService.updateBadge(this.badge.id, updatedBadge).subscribe({
        next: (response) => {
          this.isLoading = false;
          if(updatedBadge.icon && updatedBadge.extension){
            this.badge.icon=updatedBadge.icon;
            this.badge.extension=updatedBadge.extension;
          }
          if(updatedBadge.description && updatedBadge.description!=this.badge.description){
            this.badge.description=updatedBadge.description;
          }
          this.badgeUpdated.emit(this.badge);
          this.closeForm();
          this.toastr.success("Le badge est mis à jour avec succès !", "Succès");
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    }else{
      this.isLoading = false;
      this.toastr.error("Impossible de déterminer le badge. Veuillez vous reconnecter.", "Erreur");
    }
  }
}
