import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RecompenseDto } from '../../services/models';
import { ClientProfileService } from '../../services/services-custom/ClientProfileService/client-profile-service';
import { TokenService } from '../../services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingDots } from "../loading-dots/loading-dots";

@Component({
  selector: 'app-client-recompense-section',
  standalone : true,
  imports: [CommonModule, LoadingDots],
  templateUrl: './client-recompense-section.html',
  styleUrl: './client-recompense-section.css'
})
export class ClientRecompenseSection implements OnInit{
  public recompenses :RecompenseDto[]=[];
  public isLoadingData : boolean = true;
  constructor(
    private clientProfileService : ClientProfileService,
    private tokenService : TokenService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.isLoadingData=true;
    const idClient=this.tokenService.getUserId();
    if(idClient){
      this.clientProfileService.getAllRecompenses(idClient).subscribe({
        next: (recompenses) => {
          this.recompenses = recompenses;
          this.isLoadingData=false;
        },
        error: (error) => {
          this.isLoadingData=false;
        }
      });
    }else{
      this.isLoadingData=false;
      this.toastr.error("Impossible de déterminer votre compte. Veuillez vous reconnecter.", "Erreur");
    }
  }
}
