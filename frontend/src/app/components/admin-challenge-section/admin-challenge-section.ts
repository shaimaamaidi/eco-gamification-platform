import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChallengeDto } from '../../services/models';
import { ChallengeUpdateForm } from "../challenge-update-form/challenge-update-form";
import { AddChallengeForm } from "../add-challenge-form/add-challenge-form";
import { ChallengeService } from '../../services/services-custom/ChallengeService/challenge-service';
import { AdminStatsService } from '../../services/services-custom/AdminStatsService/admin-stats-service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LoadingDots } from "../loading-dots/loading-dots";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-challenge-section',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ChallengeUpdateForm, AddChallengeForm, LoadingDots],
  templateUrl: './admin-challenge-section.html',
  styleUrl: './admin-challenge-section.css'
})
export class AdminChallengeSection implements OnInit {
  public challenges :ChallengeDto[]=[];
  public filteredChallenges :ChallengeDto[]=[];

  public selectedFilter : 'all' | 'currentChallenge' | 'expiredChallenge' = 'all';
  public isNewData: boolean=false;
  public isSelectedChallenge : boolean=false; 
  public selectedChallenge : ChallengeDto={};
  public isAddingChallenge : boolean=false;
  public isLoadingData : boolean=true;
  public totalClients : number =0;
  
  constructor(private adminStatsService: AdminStatsService,private challengeService : ChallengeService,private toastr : ToastrService) {}
    
  ngOnInit(): void {
    this.isLoadingData=true;
    this.loadData();
  }

  public loadData():void{
    this.isLoadingData=true;
    forkJoin({
      challenges:this.adminStatsService.getChallenges(),
      totalClients: this.adminStatsService.countClients()
    }).subscribe({
      next: (results) => {
        this.challenges = results.challenges;
        this.filteredChallenges=this.challenges;
        this.totalClients = results.totalClients;
        this.isLoadingData=false;
      },
      error: (err) => {
        this.isLoadingData=false;
      }
    });
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

  public updateDisplayedData():void{
    this.isNewData=false;
    const data=this.filterData(this.challenges);
    if(data!==this.filteredChallenges) {
      setTimeout(() => {this.isNewData = true;}, 10);
      this.filteredChallenges=data;
    }
  }

  public filterData(challenges : ChallengeDto[]):ChallengeDto[]{
     const today = new Date();

    switch (this.selectedFilter) {
      case 'currentChallenge':
        return challenges.filter(challenge => {
          const end = challenge.endDate ? new Date(challenge.endDate) : null;
          return end!==null && end >= today;
        });

      case 'expiredChallenge':
        return challenges.filter(challenge => {
          const end = challenge.endDate ? new Date(challenge.endDate) : null;
          return end!==null && end < today;
        });

      case 'all':
      default:
        return challenges;
    }
  }

  public addChallenge():void{
    this.isAddingChallenge=true;
  }

  public updateChallenge(challenge :ChallengeDto):void{
    this.selectedChallenge=challenge;
    this.isSelectedChallenge=true;
  }

  public deleteChallenge(challenge: ChallengeDto): void {
    if (!challenge.id) {
      this.toastr.error("Impossible de déterminer le défi. Veuillez vous reconnecter.", "Erreur");
      return;
    }
 
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action supprimera le défi définitivement !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.challengeService.deleteChallenge(challenge.id as number).subscribe({
          next: () => {
            this.challenges = this.challenges.filter(c => c.id !== challenge.id);
            this.filteredChallenges=this.filteredChallenges.filter(c => c.id !== challenge.id);
            this.toastr.success("Le défi est supprimé avec succès !", "Succès");
          },
          error: () => {
            this.toastr.error("Erreur lors de la suppression du défi.", "Erreur");
          }
        });
      }
    });
  }

  public closeForm(){
    this.isSelectedChallenge=false;
    this.isAddingChallenge=false;
    this.selectedChallenge={};
  }

  public updateChallengeList(updatedChallenge: ChallengeDto) {
    const main_index = this.challenges.findIndex(c => c.id === updatedChallenge.id);
    const index = this.filteredChallenges.findIndex(c => c.id === updatedChallenge.id);
    if (main_index !== -1) {
      this.challenges[main_index] = {...updatedChallenge};
    }
    if(index!==-1){
      this.filteredChallenges[index]= {...updatedChallenge};
    }
  }
}
