import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecompenseService } from '../../services/services-custom/RecompenseService/recompense-service';
import { RecompenseDto } from '../../services/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-recompense-form',
  standalone : true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-recompense-form.html',
  styleUrl: './add-recompense-form.css'
})
export class AddRecompenseForm implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() reloadData = new EventEmitter<void>();
  
  public addRecompenseForm!: FormGroup;
  public submitClicked = false;
  public isLoading = false; 

  constructor(private fb: FormBuilder, private recompenseService: RecompenseService,private toastr : ToastrService) {}

  ngOnInit(): void {
    this.addRecompenseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      requiredBadges: [null, [Validators.required, Validators.min(0)]],
      icon: [null, Validators.required]
    });
  }

  public get name() {return this.addRecompenseForm.get('name');}

  public get description() {return this.addRecompenseForm.get('description');}

  public get requiredBadges() {return this.addRecompenseForm.get('requiredBadges');}

  public get icon() {return this.addRecompenseForm.get('icon');}

  public onIconFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addRecompenseForm.patchValue({
        icon: input.files[0]
      });
      this.addRecompenseForm.get('icon')?.updateValueAndValidity();
    }
  }

  public onSubmit() {
    this.submitClicked = true;
    if (this.addRecompenseForm.invalid) return;
  
    this.isLoading = true;

    const iconFile: File = this.addRecompenseForm.get('icon')?.value;
  
    const reader = new FileReader();
    reader.readAsDataURL(iconFile);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; 
      const extension = iconFile.name.split('.').pop(); 
  
      const recompense: RecompenseDto = {
        name: this.addRecompenseForm.get('name')?.value,
        description: this.addRecompenseForm.get('description')?.value,
        requiredBadges: this.addRecompenseForm.get('requiredBadges')?.value,
        icon: base64String,
        extension: extension
      };
  
      this.recompenseService.addRecompense(recompense).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.submitClicked = false;
          this.addRecompenseForm.reset();
          this.reloadData.emit();
          this.closeForm();
          this.toastr.success("La récompense est ajoutée avec succès !", "Succès");
        },
        error: (err) => {
          this.isLoading = false;
          this.submitClicked = false;
        }
      });
    };
    reader.onerror = (error) => {
      this.isLoading = false;
      this.toastr.error("Erreur lors du traitement de l'image. Veuillez réessayer.", "Erreur");
    };
  }

  public closeForm(): void {
    this.close.emit();
  }
}
