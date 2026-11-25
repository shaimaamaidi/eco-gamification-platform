import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BadgeService } from '../../services/services-custom/BadgeService/badge-service';
import { BadgeDto } from '../../services/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-badge-form',
  standalone : true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-badge-form.html',
  styleUrl: './add-badge-form.css'
})
export class AddBadgeForm implements OnInit{
  @Output() close = new EventEmitter<void>();
  @Output() reloadData = new EventEmitter<void>();

  public addBadgeForm!: FormGroup;
  public isLoading = false; 
  public submitClicked = false;
 
  constructor(private fb: FormBuilder,private badgeService : BadgeService,private toastr : ToastrService) {}

  ngOnInit() {
    this.addBadgeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      goal: [null, [Validators.required, Validators.min(0)]],
      icon: [null, Validators.required]
    });
  }

  public get title() { return this.addBadgeForm.get('title'); }
  public get description() { return this.addBadgeForm.get('description'); }
  public get goal() { return this.addBadgeForm.get('goal'); }
  public get icon() { return this.addBadgeForm.get('icon'); }

  public onIconFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.addBadgeForm.patchValue({ icon: file });
      this.addBadgeForm.get('icon')?.updateValueAndValidity();
    }
  }

  public onSubmit() {
    this.submitClicked = true;
    if (this.addBadgeForm.invalid) return;

    this.isLoading = true;

    const iconFile: File = this.addBadgeForm.get('icon')?.value;

    // Convertir le fichier en Base64
    const reader = new FileReader();
    reader.readAsDataURL(iconFile);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; 
      const extension = iconFile.name.split('.').pop(); 

      const badgeDto: BadgeDto = {
        title: this.addBadgeForm.get('title')?.value,
        description: this.addBadgeForm.get('description')?.value,
        goal: this.addBadgeForm.get('goal')?.value,
        icon: base64String,
        extension: extension
      };

      this.badgeService.addBadge(badgeDto).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.submitClicked = false;
          this.addBadgeForm.reset();
          this.reloadData.emit();
          this.closeForm();
          this.toastr.success("Le badge est ajouté avec succès", "Succès");
        },
        error: (err) => {
          this.isLoading = false;
          this.submitClicked = false;
        }
      });
    };
    reader.onerror = (error) => {
      this.toastr.error("Erreur lors du traitement de l'image. Veuillez réessayer.", 'Erreur');
      this.isLoading = false;
    };
  }

  public closeForm(): void {
    this.close.emit();
  }
}
