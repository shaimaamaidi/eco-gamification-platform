import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BadgeDto } from '../../services/models';
import { ClientProfileService } from '../../services/services-custom/ClientProfileService/client-profile-service';
import { TokenService } from '../../services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingDots } from "../loading-dots/loading-dots";

@Component({
  selector: 'app-client-badge-section',
  standalone:true,
  imports: [CommonModule, LoadingDots],
  templateUrl: './client-badge-section.html',
  styleUrl: './client-badge-section.css'
})
export class ClientBadgeSection implements OnInit {
  public badges: BadgeDto[] = [];
  public isLoadingData : boolean=true;

  constructor(private clientProfileService: ClientProfileService,private tokenService : TokenService, private toastr : ToastrService) {}
  
  ngOnInit(): void {
    this.isLoadingData=true;
    const idClient =this.tokenService.getUserId();
    if(idClient){
      this.clientProfileService.getBadges(idClient).subscribe({
        next: (badges: BadgeDto[]) => {
          this.badges = badges;
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
}

