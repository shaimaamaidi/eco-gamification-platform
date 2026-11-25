import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RecompenseDto } from '../../services/models';
import { AddRecompenseForm } from "../add-recompense-form/add-recompense-form";
import { RecompenseUpdateForm } from "../recompense-update-form/recompense-update-form";
import { AdminStatsService } from '../../services/services-custom/AdminStatsService/admin-stats-service';
import { RecompenseService } from '../../services/services-custom/RecompenseService/recompense-service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LoadingDots } from "../loading-dots/loading-dots";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-recompense-section',
  standalone : true,
  imports: [CommonModule, AddRecompenseForm, RecompenseUpdateForm, LoadingDots],
  templateUrl: './admin-recompense-section.html',
  styleUrl: './admin-recompense-section.css'
})
export class AdminRecompenseSection implements OnInit {
  public isSelectedRecompense : boolean=false;
  public isAddingRecompense : boolean=false;
  public selectedRecompense : RecompenseDto ={};
  public isLoadingData : boolean=true;
  public recompenses : RecompenseDto[]=[]
  public totalClients : number =0 ;

  constructor(private adminStatsService : AdminStatsService, private recompenseService : RecompenseService, private toastr : ToastrService){}

  ngOnInit(): void {
    this.isLoadingData=true;
    this.loadData();
  }

  public loadData():void{
    this.isLoadingData=true;
    forkJoin({
      recompenses:this.adminStatsService.getRecompenses(),
      totalClients: this.adminStatsService.countClients()
    }).subscribe({
      next: (results) => {
        this.recompenses = results.recompenses;
        this.totalClients = results.totalClients;
        this.isLoadingData=false;
      },
      error: (err) => {
        this.isLoadingData=false;
      }
    });
  }

  public updateRecompense(recompense :RecompenseDto):void{
    this.selectedRecompense=recompense;
    this.isSelectedRecompense=true;
  }

  public deleteRecompense(recompense: RecompenseDto): void {
    if (!recompense.id) {
      this.toastr.error("Impossible de déterminer la récompense. Veuillez vous reconnecter.", "Erreur");
      return;
    }

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action supprimera la récompense définitivement !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recompenseService.deleteRecompense(recompense.id as number).subscribe({
          next: () => {
            this.recompenses = this.recompenses.filter(r => r.id !== recompense.id);
            this.toastr.success("La récompense est supprimée avec succès !", "Succès");
          },
          error: () => {
            this.toastr.error("Erreur lors de la suppression de la récompense.", "Erreur");
          }
        });
      }
    });
  }

  public addRecompense():void{this.isAddingRecompense=true;}

  public closeForm():void{
    this.isAddingRecompense=false;
    this.isSelectedRecompense=false;
    this.selectedRecompense={};
  }
  
  public updateRecompenseList(updatedRecompense: RecompenseDto) {
    const index = this.recompenses.findIndex(r => r.id === updatedRecompense.id);
    if (index !== -1) {
      this.recompenses[index] = {...updatedRecompense};
    }
  }

}
