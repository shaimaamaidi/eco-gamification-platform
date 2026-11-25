import { Component , OnInit } from '@angular/core';
import { ActionDto } from '../../services/models';
import { ActionDetails } from "../action-details/action-details";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddActionForm } from "../add-action-form/add-action-form";
import { TokenService } from '../../services/token/token.service';
import { AdminStatsService } from '../../services/services-custom/AdminStatsService/admin-stats-service';
import { ClientProfileService } from '../../services/services-custom/ClientProfileService/client-profile-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';
import { LoadingDots } from "../loading-dots/loading-dots";

@Component({
  selector: 'app-action-section',
  standalone : true,
  imports: [CommonModule, FormsModule, ActionDetails, AddActionForm, LoadingDots],
  templateUrl: './action-section.html',
  styleUrl: './action-section.css'
})
export class ActionSection implements OnInit{  
  public isAdmin : boolean=false;
 
  public actionData:ActionDto[]=[];

  public filetredData : ActionDto[]=[];
  public selectedAction: ActionDto | null = null;
  public selectedFilter :'global'| 'byAction' | 'byStatus'='global';
  public selectedActionType: 'tous' | 'tri' | 'compostage' | 'nettoyage' | 'plantation' | 'recyclage' ='tous';
  public selectedStatus: 'tous' | 'waiting' | 'accepted' | 'rejected' = 'tous';
  public showForm: boolean = false;

  public isNewData = false;
  public isLoadingData : boolean=true;
 
  constructor(
    private adminStatService:AdminStatsService,
    private authService: AuthService,
    private clientProfileService : ClientProfileService,
    private tokenService : TokenService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoadingData=true;
    this.isAdmin=(this.authService.getRole()=="ADMIN");
    this.loadData()
  }

  public loadData(){
    this.isLoadingData=true;
    if(this.isAdmin)
      this.getActionsForAdmin();
    else
      this.getActionsForClient();
  }

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
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  public updateDisplayedData() {
    this.isNewData=false;
    const data = this.getFiletredActions(this.selectedFilter, this.selectedActionType, this.selectedStatus);
    if(data!==this.filetredData) {
      setTimeout(() => {this.isNewData = true;}, 20);
      this.filetredData=data;
    }
  }

  private getFiletredActions(type: string, actionType?: string, status?: string): ActionDto[] {
    if((type==='byAction' && (!actionType || actionType==='tous')) || (type==='byStatus' && (!status || status==='tous')))
      type='global';
  
    const results: ActionDto[] = [];
  
    if(type==='global'){
      return this.actionData;
    }else if(type==='byAction'){
      for (const action of this.actionData) 
        if (action.type?.toLowerCase()===actionType)
          results.push(action);
    }else if(type==='byStatus'){
      for (const action of this.actionData) 
        if (action.status?.toLowerCase()===status)
          results.push(action);
    }
    return results;
  }
    
  public onSelectAction(action: ActionDto) {this.selectedAction = action;}

  public onCloseDetails() {this.selectedAction = null;}

  public closeForm():void {this.showForm = false;}
  
  public openForm():void{this.showForm = true;}

  private getActionsForAdmin():void{
    this.adminStatService.getAllActions().subscribe({
      next: (data) => {
        this.actionData = data;
        this.filetredData=this.actionData;
        this.isLoadingData=false;
      },
      error:(err)=>{
        this.isLoadingData=false;
      }
    });
  }

  private getActionsForClient():void{
    const idClient=this.tokenService.getUserId();
    if (idClient && typeof idClient === 'number'){
      this.clientProfileService.getAllctions(idClient).subscribe({
        next: (data) => {
          this.actionData = data;
          this.filetredData=this.actionData;
          this.isLoadingData=false;
        },
        error:(err)=>{
          this.isLoadingData=false;
        }
      });
    }else{
      this.isLoadingData=false;
      this.toastr.error("Impossible de déterminer votre compte. Veuillez vous reconnecter", "Erreur");
    }
  }
  
}
