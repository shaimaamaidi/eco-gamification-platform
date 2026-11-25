import { Component, OnInit } from '@angular/core';
import { ActionType, ClientRanking, RankingType } from '../../models/types';
import { CommonModule } from '@angular/common';
import { RankingItem } from "../ranking-item/ranking-item";
import { FormsModule } from '@angular/forms';
import { ClientDto } from '../../services/models';
import { ClientDetails } from "../client-details/client-details";
import { ClassementService } from '../../services/services-custom/ClassementService/classement-service';
import { LoadingDots } from "../loading-dots/loading-dots";

@Component({
  selector: 'app-admin-client-section',
  standalone:true,
  imports: [CommonModule, RankingItem, FormsModule, ClientDetails, LoadingDots],
  templateUrl: './admin-client-section.html',
  styleUrl: './admin-client-section.css'
}) 
export class AdminClientSection implements OnInit{
  public searchTerm: string = '';
  public rankingType: RankingType = 'global';
  public selectedActionType: ActionType  = 'tous';
  public selectedCity: string = '';
 
  private displayedRankings: ClientRanking[] = [];
  public selectedClient?: ClientDto;

  public clients: ClientDto[] = [];
  
  public isLoadingData : boolean = true;
  constructor(private classementService:ClassementService){}
  
  ngOnInit() {
    this.isLoadingData=true;
    this.classementService.getClientsWithClassements().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.updateDisplayedData();
        this.isLoadingData=false;
      },
      error : (err)=>{
        this.isLoadingData=false;
      }
    });
  }

  public updateDisplayedData() {
    this.displayedRankings = this.getRankings(this.rankingType, this.selectedActionType, this.selectedCity)
      .sort((a, b) => a.rank - b.rank); 
  }

  private getRankings(type: RankingType, actionType?: ActionType, city?: string): ClientRanking[] {
    if((type==='by_Action' && (!actionType || actionType==='tous')) || (type==='by_City' && (!city || city.trim()==="")))
      type='global';

    const results: ClientRanking[] = [];

    if(type==='global'){
      for (const client of this.clients) {
        if (!client.classement) continue;

        for (const c of client.classement) {
          if (c.type?.toLowerCase() !== type) continue;

          results.push({
            id: client.id,
            name: client.userName,
            points: c.totalPoints,
            rank: c.position,
            actionType: c.actionType,
            city: c.city
          } as ClientRanking);
        }
      }
    }else if(type==='by_Action'){
      for (const client of this.clients) {
        if (!client.classement) continue;

        for (const c of client.classement) {
          if (c.type?.toLowerCase() !== type.toLowerCase()) continue;
          if (actionType && c.actionType?.toLowerCase() !== actionType.toLowerCase()) continue;
          results.push({
            id: client.id,
            name: client.userName,
            points: c.totalPoints,
            rank: c.position,
            actionType: c.actionType,
            city: c.city
          } as ClientRanking);
        }
      }
    }else if(type==='by_City'){
      const cityLower = city?.toLowerCase();
      for (const client of this.clients) {
        if (!client.classement) continue;

        for (const c of client.classement) {
          if (c.type?.toLowerCase() !== type.toLowerCase()) continue;
          if (cityLower && (c.city?.toLowerCase() !== cityLower.toLowerCase())) continue;
          results.push({
            id: client.id,
            name: client.userName,
            points: c.totalPoints,
            rank: c.position,
            actionType: c.actionType,
            city: c.city
          } as ClientRanking);
        }
      }
    }
    return results;
  }

  public get filteredRankings(): ClientRanking[] {
    if (!this.searchTerm?.trim()) return this.displayedRankings;
    const searchLower = this.searchTerm.toLowerCase();
    return this.displayedRankings.filter(r => r.name.toLowerCase().includes(searchLower));
  } 

  public onRankingTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value as RankingType;
    if (value === 'global' || value === 'by_Action' || value === 'by_City') {
      this.rankingType = value;
      if (value !== 'by_Action') this.selectedActionType = 'tous';
      if (value !== 'by_City') this.selectedCity = '';
      this.updateDisplayedData();
    }
  }

  public onClientClick(clientId: number) {
    this.selectedClient = this.clients.find(c => c.id === clientId);
  }
  
  public onCloseDetails(){
    this.selectedClient=undefined;
  }
}
