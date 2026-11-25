import { Component , OnInit } from '@angular/core';
import { User } from '../../models/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientProfileService } from '../../services/services-custom/ClientProfileService/client-profile-service';
import { TokenService } from '../../services/token/token.service';
import { ClientDto } from '../../services/models';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';
import { SharedService } from '../../services/services-custom/SharedService/shared-service';
import { LoadingDots } from "../loading-dots/loading-dots";

@Component({
  selector: 'app-profile-section',
  standalone:true,
  imports: [CommonModule, FormsModule, LoadingDots],
  templateUrl: './profile-section.html',
  styleUrl: './profile-section.css'
})
export class ProfileSection implements OnInit{
  public isAdmin:boolean=false;
  public currentUser: User | null = null;
  
  public isLoading = false;
  public name='';
  public city='';
  
  public isLoadingData : boolean=true;
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private authService : AuthService,
    private clientService : ClientProfileService,
    private tokenService:TokenService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoadingData=true;
    this.isAdmin=(this.authService.getRole()=="ADMIN");
    this.sharedService.currentUser$.subscribe({
      next: (u) => {
        this.currentUser = u;
        this.name = this.currentUser.userName;
        this.city = this.currentUser.city;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      }
    });
  }

  public saveChanges() {
    if (!this.currentUser) return;

    this.isLoading = true;
    const hasChanges =(this.name !== this.currentUser.userName) || (this.city !== this.currentUser.city );
    if (!hasChanges) {
      this.isLoading = false;
      this.toastr.info("Pas de modification est détectée", "Info");
      return;
    }
    const updatedClient :ClientDto = {
      userName: this.name,
      city: this.city 
    };

    const idClient=this.tokenService.getUserId();

    if (!idClient) {
      this.isLoading = false;
      this.toastr.error("Impossible de déterminer votre compte. Veuillez vous reconnecter.", "Erreur");
      return;
    }
    this.clientService.updateClient(idClient, updatedClient).subscribe({
      next: (res) => {
        this.sharedService.loadCurrentUser();
        this.isLoading = false;
        this.toastr.success("Les données sont mise à jour avec succès !", "Succès");
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  public changePassword() {
    this.router.navigate(['reset_password'], { queryParams: { forgetPassword: false } });
  }
}
 
