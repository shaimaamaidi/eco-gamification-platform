import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChallengeDto } from '../../services/models';
import { ClientProfileService } from '../../services/services-custom/ClientProfileService/client-profile-service';
import { TokenService } from '../../services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingDots } from "../loading-dots/loading-dots";

@Component({
  selector: 'app-client-challenge-section',
  standalone:true,
  imports: [CommonModule, LoadingDots],
  templateUrl: './client-challenge-section.html',
  styleUrl: './client-challenge-section.css'
})
export class ClientChallengeSection implements OnInit{
  public challenges: ChallengeDto[] = [];
  public isLoadingData : boolean=true;

  constructor(private clientProfileService: ClientProfileService,private tokenService : TokenService, private toastr : ToastrService) {}
  
  ngOnInit(): void {
    this.isLoadingData=true;
    const idClient=this.tokenService.getUserId();
    if(idClient){
      this.clientProfileService.getChallenges(idClient).subscribe({
        next: (challenges) => {
          this.challenges = challenges;
          this.isLoadingData=false;
        },
        error : (err)=>{
          this.isLoadingData=false;
        }
      });
    }else{
      this.isLoadingData=false;
      this.toastr.error("Impossible de déterminer votre compte. Veuillez vous reconnecter.", "Erreur");
    }
  }
  
  public getDaysBeforeExpiration(endDate: string): string {
    if(endDate==="")
      return "";
    const today = new Date();
    const expirationDate = new Date(endDate);
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Expiré";
    } else if (diffDays === 0) {
      return "Expire aujourd'hui";
    } else {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''} restant${diffDays > 1 ? 's' : ''}`;
    }
  }
}
