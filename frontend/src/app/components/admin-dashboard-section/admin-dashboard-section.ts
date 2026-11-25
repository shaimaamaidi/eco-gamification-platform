import { Component, OnInit } from '@angular/core';
import { ClientStatsSection } from "../client-stats-section/client-stats-section";
import { ActionStatsSection } from "../action-stats-section/action-stats-section";
import { AdminStatsService } from '../../services/services-custom/AdminStatsService/admin-stats-service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard-section',
  standalone : true,
  imports: [CommonModule, ClientStatsSection, ActionStatsSection],
  templateUrl: './admin-dashboard-section.html',
  styleUrl: './admin-dashboard-section.css'
})
export class AdminDashboardSection implements OnInit {
  public recompenseRate:number=0;
  public challengeRate:number=0;
  public badgeRate:number=0
  public isLoadingAll : boolean=false;
  public loadedChildren = { client: false, action: false , dash : false };

  constructor(private adminStatsService : AdminStatsService){}
  
  ngOnInit(): void {
    this.onChildLoaded('dash');
    forkJoin({
      badgeRate: this.adminStatsService.getBadgeSuccessRate(),
      challengeRate: this.adminStatsService.getChallengeSuccessRate(),
      recompenseRate: this.adminStatsService.getRecompenseSuccessRate()
    }).subscribe({
      next: (results) => {
        this.badgeRate = results.badgeRate;
        this.challengeRate = results.challengeRate;
        this.recompenseRate = results.recompenseRate;
        this.finishChildLoad('dash'); 
      },
      error: (err) => {
        this.finishChildLoad('dash'); 
      }
    });
  }

  onChildLoaded(section: 'client' | 'action' | 'dash') {
    this.loadedChildren[section] = true;
    this.isLoadingAll=true;
  }

  finishChildLoad(section: 'client' | 'action' | 'dash') {
    this.loadedChildren[section] = false;
    this.checkAllLoaded();
  }

  checkAllLoaded() {
    if(this.loadedChildren['client']===false && this.loadedChildren['action']===false && this.loadedChildren['dash']===false)
      this.isLoadingAll = false;
  }
}
