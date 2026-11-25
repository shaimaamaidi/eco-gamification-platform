import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionService } from '../../services/services-custom/ActionService/action-service';
import { TokenService } from '../../services/token/token.service';
import { ActionDto } from '../../services/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-action-form',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-action-form.html',
  styleUrl: './add-action-form.css'
})
export class AddActionForm implements OnInit{
  @Output() reloadData = new EventEmitter<void>();

  public actionForm!: FormGroup;
  public submitClicked = false;
  public selectedImage: File | null = null;
  public isLoading=false;

  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private actionService : ActionService,
    private tokenService : TokenService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.actionForm = this.fb.group({
      type: ['', Validators.required],
      image: [null, Validators.required] 
    });
  }

  public get type() {return this.actionForm.get('type');}

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.actionForm.patchValue({
        image: this.selectedImage
      });
      this.actionForm.get('image')?.markAsTouched();
    }
  }

  public onSubmit() {
    this.submitClicked = true;
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }
      
    this.isLoading = true;
    
    const iconFile: File = this.actionForm.get('image')?.value;

    const reader = new FileReader();
    reader.readAsDataURL(iconFile);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      const extension = iconFile.name.split('.').pop(); 
      
      const actionDTO: ActionDto = {
        type: this.actionForm.get('type')?.value,
        image: base64String,
        extension: extension
      };

      const clientId = this.tokenService.getUserId(); 
      if (clientId && typeof clientId === 'number') {
        this.actionService.addAction(clientId,actionDTO).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.submitClicked = false;
            this.actionForm.reset();
            this.reloadData.emit();
            this.closeForm();
            this.toastr.success("L'action est ajoutée avec succès", "Succès");
          },
          error: (err) => {
            this.isLoading = false;
            this.submitClicked = false;
          }
        });
      }else {
        this.toastr.error("Impossible de déterminer votre compte. Veuillez vous reconnecter.","Erreur");
      }
    }
    reader.onerror = (error) => {
      this.isLoading = false;
      this.toastr.error("Erreur lors du traitement de l'image. Veuillez réessayer.", 'Erreur');
    }; 
  }

  public closeForm(): void {
    this.close.emit();
  }
}
