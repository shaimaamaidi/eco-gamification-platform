import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionDto } from '../../services/models';
import { ActionService } from '../../services/services-custom/ActionService/action-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.css'
})
export class FeedbackForm {
  @Output() feedbackSubmitted = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() closeDetail = new EventEmitter<void>();
  @Output() reloadData = new EventEmitter<void>();

  @Input() action!: ActionDto;

  public feedbackForm!: FormGroup;
  public isLoading = false; 
  public submitClicked = false;
 
  constructor(private fb: FormBuilder, private actionService : ActionService, private toastr: ToastrService) {}

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      feedback: ['', Validators.required]
    });
  }

  public get feedback() { return this.feedbackForm.get('feedback'); }

  public onSubmit() {
    this.submitClicked = true;
    if (this.feedbackForm.invalid) return;

    this.isLoading = true;

    const action: ActionDto = {
      ...this.action,
      feedback: this.feedbackForm.value.feedback,
    };

    if (this.action && typeof this.action.id === 'number') {
      this.actionService.rejectAction(this.action.id, action).subscribe({
        next: (res) => {
            this.isLoading = false;
            this.submitClicked = false;
            this.feedbackForm.reset();
            this.reloadData.emit();
            this.closeForm();
            this.closeDetail.emit();
            this.toastr.success("Votre action est validé avec succès !", "Succès");
          },
          error: (err) => {
            this.isLoading = false;
            this.submitClicked = false;
          }
        });
    } else {
      this.isLoading = false;
      this.submitClicked = false;
      this.toastr.error("Impossible de déterminer l'action. Veuillez vous reconnecter.", "Erreur");
    }
  }

  public closeForm(): void {
    this.close.emit();
  }
}
