import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionDto } from '../../services/models';
import { CommonModule } from '@angular/common';
import { FeedbackForm } from "../feedback-form/feedback-form";
import { ActionService } from '../../services/services-custom/ActionService/action-service';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-action-details',
  standalone :true,
  imports: [CommonModule, FeedbackForm],
  templateUrl: './action-details.html',
  styleUrl: './action-details.css'
})
export class ActionDetails {
  @Output() reloadData = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  @Input() action!: ActionDto;
  @Input() isAdmin:boolean=false;

  public showFeedbackForm = false;
  public isLoading :boolean=false;

  constructor(private actionService : ActionService,private toastr : ToastrService){}

  public getIconClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'tri': return '/assets/tri.svg';
      case 'nettoyage': return '/assets/nettoyage.svg';
      case 'compostage': return '/assets/compostage.svg';
      case 'plantation': return '/assets/plantation.svg';
      case 'recyclage': return '/assets/recyclage.svg';
      default: return '/assets/default_action.svg';
    }
  }

  public getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted': return 'text-green-800';
      case 'waiting': return 'text-yellow-800';
      case 'rejected': return ' text-red-800';
      default: return ' text-black';
    }
  }

  public closeDeatil(){
    this.close.emit();    
  }

  public validateAction() {
    this.isLoading = true;

    if (this.action && typeof this.action.id === 'number') {
      this.actionService.acceptAction(this.action.id).subscribe({
        next: (res) => {
            console.log('hi')
            this.isLoading = false;
            this.reloadData.emit();
            this.closeDeatil();
            this.toastr.success("L'action est validée avec succès", "Succès");
          },
          error: (err) => {
            this.isLoading = false;
            console.log("helllllll")
          }
        });
    } else {
      this.toastr.error("Impossible de déterminer l'action. Veuillez vous reconnecter.", 'Erreur');
      this.isLoading = false;
    }
  }

  public rejectAction() {
    this.showFeedbackForm = true;
  }

  public closeFeedBackForm(){
    this.showFeedbackForm = false;
  }
}
