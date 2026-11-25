import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BadgeDto } from '../../services/models';
import { BadgeUpdateForm } from "../badge-update-form/badge-update-form";
import { AddBadgeForm } from "../add-badge-form/add-badge-form";
import { BadgeService } from '../../services/services-custom/BadgeService/badge-service';
import { AdminStatsService } from '../../services/services-custom/AdminStatsService/admin-stats-service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LoadingDots } from "../loading-dots/loading-dots";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-badge-section',
  standalone : true,
  imports: [CommonModule, BadgeUpdateForm, AddBadgeForm, LoadingDots],
  templateUrl: './admin-badge-section.html',
  styleUrl: './admin-badge-section.css'
})
export class AdminBadgeSection implements OnInit {
  public isAddingBadgeClicked : boolean=false;
  public isbadgeSelected : boolean =false;
  public selectedBdage : BadgeDto={};
  public badges: BadgeDto[] = [];
  public isLoadingData : boolean=true;

  public totalClients: number = 0;
 
  constructor(private adminStatsService: AdminStatsService,private badgeService : BadgeService,private toastr : ToastrService) {}
  
  ngOnInit(): void {
    this.isLoadingData=true;
    this.loadData();
  }
  
  public loadData():void{
    this.isLoadingData=true;
    forkJoin({
      badges:this.adminStatsService.getBadges(),
      totalClients: this.adminStatsService.countClients()
    }).subscribe({
      next: (results) => {
        this.badges = results.badges;
        this.totalClients = results.totalClients;
        this.isLoadingData=false;
      },
      error: (err) => {
        this.isLoadingData=false;
      }
    });
  }

  public updateBadge(badge: BadgeDto) {
    this.selectedBdage=badge;
    this.isbadgeSelected=true;
  }

  public closeForm(){
    this.isbadgeSelected=false;
    this.isAddingBadgeClicked=false;
    this.selectedBdage={};
  }

  public deleteBadge(badge: BadgeDto) {
    if (!badge.id) {
      this.toastr.error("Impossible de déterminer le badge. Veuillez vous reconnecter.", "Erreur");
      return;
    }else{
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Cette action supprimera le badge définitivement !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.badgeService.deleteBadge(badge.id as number).subscribe({
            next: (response) => {
              this.badges = this.badges.filter(b => b.id !== badge.id);
              this.toastr.success("Le badge est supprimé avec succès !", "Succès");
            },
            error: (err) => {
              this.toastr.error("Erreur lors de la suppression du badge.", "Erreur");
            }
          });
        }
      });
    }
  }
  
  public addBadge(){
    this.isAddingBadgeClicked=true;
  }

  public updateBadgeInList(updatedBadge: BadgeDto) {
    const index = this.badges.findIndex(b => b.id === updatedBadge.id);
    if (index !== -1) {
      this.badges[index] = {...updatedBadge};
    }
  }
} 
