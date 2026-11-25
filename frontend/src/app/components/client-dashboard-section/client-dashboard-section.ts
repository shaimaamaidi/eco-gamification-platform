import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartModule} from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { RankingItem } from "../../components/ranking-item/ranking-item";
import { StatsCardProps, ClientRanking, RankingType, ActionType } from '../../models/types';
import { ActionDto, ClientDto } from '../../services/models';
import { FormsModule } from '@angular/forms';
import { ClientProfileService } from '../../services/services-custom/ClientProfileService/client-profile-service';
import { TokenService } from '../../services/token/token.service';
import { ClassementService } from '../../services/services-custom/ClassementService/classement-service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { LoadingDots } from "../loading-dots/loading-dots";

interface ChartSeriesItem {
  name: string;
  value: number | null;
}

interface ChartResult {
  name: string;
  series: ChartSeriesItem[];
}
@Component({
  selector: 'app-client-dashboard-section',
  standalone:true,
  imports: [CommonModule, FormsModule, LineChartModule, RankingItem, LoadingDots],
  templateUrl: './client-dashboard-section.html',
  styleUrl: './client-dashboard-section.css'
})
export class ClientDashboardSection implements OnInit,AfterViewInit{
  private actionsAccepted :number=0;
  private badgesLocked : number=0;
  private challengesCompleted : number=0;
  private recompensesAchieved : number=0;

  private actions:ActionDto[]=[];

  public statsCards : StatsCardProps[] = [];
  public results:ChartResult []= [];
  public yMaxValue :number = 10;
   
  public currentClient :ClientDto={
    id: 0,
    userName: '',
    mail: '',
    city: '',
    totalPoints: 0
  };

  private clients: ClientDto[] =[];
  public displayedRankings : ClientRanking[]=[];
  public rankingType: RankingType = 'global';
  public selectedActionType: ActionType  = 'tous';
  
  public isLoadingData : boolean=true;

  public curve = shape.curveMonotoneX;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('rankingItems', { read: ElementRef }) rankingItems!: QueryList<ElementRef>;

  constructor(
    private clientProfileService : ClientProfileService,
    private tokenService : TokenService,
    private classementService : ClassementService,
    private toastr : ToastrService
  ){}
    
  ngOnInit(): void {
    this.isLoadingData=true;
    this.loadData();
  }
  
  ngAfterViewInit() {
    this.scrollToCurrentUser();
  }

  private loadData(){
    const idClient =this.tokenService.getUserId();
    if(!idClient){
      this.isLoadingData=false;
      this.toastr.error("Impossible de déterminer votre compte. Veuillez vous reconnecter.", "Erreur");
      return;
    }

    forkJoin({
      currentClient: this.clientProfileService.getUser(idClient),
      clients: this.classementService.getClientsWithClassements(),
      actions: this.clientProfileService.getAllctions(idClient),
      stats: this.clientProfileService.getStats(idClient)
    }).subscribe({
      next: (results) => {
        if (results.currentClient) {
          this.currentClient = results.currentClient;
        }
        this.clients = results.clients;
        this.updateDisplayedData();

        this.actions = results.actions;
        this.actionsAccepted = this.countAcceptedActions();
        this.results = this.getActionsForCurrentWeek();

        const stats = results.stats;
        this.badgesLocked = stats.badgesLocked ?? 0;
        this.challengesCompleted = stats.challengesCompleted ?? 0;
        this.recompensesAchieved = stats.recompensesAchieved ?? 0;
        this.statsCards = [
          { title: 'Actions Acceptées', value: this.actionsAccepted, icon: 'assets/action_accepted.svg', color: 'from-blue-400 to-blue-500' },
          { title: 'Badges Débloqués', value: this.badgesLocked, icon: 'assets/badge_locked.svg', color: 'from-orange-400 to-orange-500' },
          { title: 'Défis Complétés', value: this.challengesCompleted, icon: 'assets/challenge_completed.svg', color: 'from-purple-400 to-purple-500' },
          { title: 'Récompenses Prises', value: this.recompensesAchieved, icon: 'assets/recompense_taked.svg', color: 'from-pink-400 to-pink-500' }
        ];

        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      }
    });
  } 

  private countAcceptedActions(): number {
    return this.actions.reduce((count, action) => {
      return count + (action.status === "ACCEPTED" ? 1 : 0);
    }, 0);
  }

  private getActionsForCurrentWeek(): ChartResult[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const firstDayOfWeek = new Date(today);
    const day = today.getDay();
    const diffToMonday = (day + 6) % 7;
    firstDayOfWeek.setDate(today.getDate() - diffToMonday);
    firstDayOfWeek.setHours(0, 0, 0, 0);
  
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const counts = Array(days.length).fill(0);
  
    this.actions.forEach(action => {
      if (!action.date) return;
  
      const actionDate = new Date(action.date);
      actionDate.setHours(0, 0, 0, 0);
  
      const diffDays = Math.floor(
        (actionDate.getTime() - firstDayOfWeek.getTime()) / (1000 * 60 * 60 * 24)
      );
  
      if (diffDays >= 0 && diffDays < 7) {
        counts[diffDays]++;
      }
    });
    return [
      {
        name: "Actions effectuées",
        series: days.map((dayName, index) => {
          const currentDay = new Date(firstDayOfWeek);
          currentDay.setDate(firstDayOfWeek.getDate() + index);

          if (currentDay > today) {
            return { name: dayName, value: null };
          }
          if(counts[index]>this.yMaxValue)
            this.yMaxValue=counts[index];
          return { name: dayName, value: counts[index] };
        })
      }
    ];
  }
  
  public onRankingTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value as RankingType;
    if (value === 'global' || value === 'by_Action' || value === 'by_City') {
      this.rankingType = value;
      if (value !== 'by_Action') this.selectedActionType = 'tous';
      this.updateDisplayedData();
    }
  }

  public updateDisplayedData() {
    this.displayedRankings = this.getRankings(this.rankingType, this.selectedActionType, this.currentClient.city)
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
          if (c.type?.toLowerCase() !== type.toLowerCase()) continue;
    
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
          if (c.type?.toLowerCase()  !== type.toLowerCase()) continue;
              
          if (actionType && c.actionType?.toLowerCase()  !== actionType.toLowerCase()) continue;
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
            if (c.type?.toLowerCase()  !== type.toLowerCase()) continue;
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
  
  private scrollToCurrentUser() {
    if (!this.scrollContainer || !this.rankingItems) return;
  
    const itemsArray = this.rankingItems.toArray();
    const index = this.displayedRankings.findIndex(
      c => c.name === this.currentClient?.userName
    );
  
    if (index !== -1 && itemsArray[index]) {
      const container = this.scrollContainer.nativeElement;
      const element = itemsArray[index].nativeElement;
  
      const offsetTop = element.offsetTop;
      const paddingTop = 16;
      container.scrollTop = offsetTop - paddingTop > 0 ? offsetTop - paddingTop : 0;
    }
  }
}
  