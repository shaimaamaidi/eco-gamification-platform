import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DailyActionStatsDto, DailyStatsDto } from '../../services/models';
import { AdminStatsService } from '../../services/services-custom/AdminStatsService/admin-stats-service';
import { forkJoin } from 'rxjs';

interface DailyAggregatedData {
  date: string;
  current: number;
  previous: number | null;
  thirdLine: number | null;
} 

interface ActionDistribution{
  name:string;
  value:number;
}


@Component({
  selector: 'app-action-stats-section',
  standalone : true,
  imports: [CommonModule, NgxChartsModule, FormsModule, DecimalPipe],
  templateUrl: './action-stats-section.html',
  styleUrl: './action-stats-section.css'
})
export class ActionStatsSection implements OnInit{
  @Input()isLoadingAll : boolean=true;
  @Output() onChildLoaded = new EventEmitter<void>();
  @Output() finishChildLoad = new EventEmitter<void>();

  public totalClients : number=0;
  private dailyStats : DailyActionStatsDto[] = [];

  private filtredData :DailyActionStatsDto[]=[];
  public totalActions:number=0;
  public refusedActions:number=0;
  public newActions:number=0;
  public newActionsChange:number=0;
  public nbreActionsWaiting:number=0;

  public actionsDistributionData :ActionDistribution[] = [];
  public customActionColors: { name: string; value: string }[] = [];
  public goback:boolean=false;
  public gonext:boolean=false;

  private dailyActionData :DailyAggregatedData[]=[]
  public results: {
    name: string;
    series: {
      name: string;
      value: number | null;
    }[];
  }[] = [];

  public selectedType: 'total' | 'tri' | 'recyclage' | 'composatge' | 'nettoyage' | 'platation'  = 'total';
  public selectedStatus: 'total' | 'rejected' | 'waiting' | 'accepted' = 'total';
  public selectedPeriod: 'jour' | 'mois' | 'annee' = 'jour';
  private weekOffset = 0;

  constructor(private adminStatsService:AdminStatsService){}

  ngOnInit() {
    this.onChildLoaded.emit();
    this.loadStats();
  }

  private loadStats() {
    forkJoin({
      totalClients: this.adminStatsService.countClients(),
      dailyActionStats: this.adminStatsService.getDailyActionStats()
    }).subscribe({
      next: (results) => {
        // Total clients
        this.totalClients = results.totalClients;

        // Daily action stats
        this.dailyStats = results.dailyActionStats;
        this.calculateStats();
        this.filtredData = this.dailyStats;

        if (this.filtredData.length > 0) {
          this.actionsDistributionData = this.getActionDistribution(this.filtredData);
          this.customActionColors = [
            { name: 'tri', value: 'hsl(142.1, 76.2%, 36.3%)' },
            { name: 'compostage', value: 'hsl(217.2, 91.2%, 59.8%)' },
            { name: 'recyclage', value: 'hsla(217, 42%, 40%, 1.00)' },
            { name: 'nettoyage', value: 'hsl(30, 100%, 50%)' },
            { name: 'plantation', value: 'hsl(120, 60%, 50%)' }
          ];
        } else {
          this.actionsDistributionData = [
            { name: 'Aucune action', value: 1 }
          ];
          this.customActionColors = [
            { name: 'Aucune action', value: '#E5E7EB' } 
          ];
        }

        // Filtrage et préparation des données pour affichage
        this.filtredData = this.filterDailyData(this.filtredData);
        this.dailyActionData = this.processDailyData(this.filtredData);
        this.results = this.getFilteredData(this.weekOffset);

        
        this.goback = this.hasDataForWeek(this.weekOffset+1);
        this.gonext=false;

        this.finishChildLoad.emit();
      },
      error: (err) => {
        this.finishChildLoad.emit();
      }
    });
  }

  private calculateStats() {
    this.totalActions = this.dailyStats.reduce((sum, stat) => sum + (stat.count ?? 0), 0);

    this.refusedActions = this.dailyStats.filter(stat => (stat.status?.toLowerCase()) === 'rejected').reduce((sum, stat) => sum + (stat.count ?? 0), 0);


    this.nbreActionsWaiting = this.dailyStats.filter(stat => (stat.status?.toLowerCase()) === 'waiting').reduce((sum, stat) => sum + (stat.count ?? 0), 0);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toISOString().slice(0, 10);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const todayCount = this.dailyStats.filter(stat => stat.date === todayStr).reduce((sum, stat) => sum + (stat.count ?? 0), 0);

    const yesterdayCount = this.dailyStats.filter(stat => stat.date === yesterdayStr).reduce((sum, stat) => sum + (stat.count ?? 0), 0);

    this.newActions = todayCount;
    this.newActionsChange = (yesterdayCount!==0) ? (((todayCount - yesterdayCount)/yesterdayCount)*100) : 100;
  }
    
  private regroupedData(data: DailyActionStatsDto[]):DailyActionStatsDto[]{
    const results:DailyActionStatsDto[]=[];
    for(const d of data){
      if (!d.date) continue; 
      
      const exists = results.some(item => item.date === d.date);
      
      if (exists) continue;
      const count = this.getCount(data, d.date);
  
      const aux: DailyActionStatsDto = {
        date: d.date,
        count: count,
        type: '',
        status:''
      };
      
      results.push(aux);
    }
    return results;
  }
  
  private filterDailyData(data: DailyActionStatsDto[]):DailyActionStatsDto[]{
    if(this.selectedStatus==='total' && this.selectedType=== 'total'){
      return this.regroupedData(data); 
    }
    if(this.selectedStatus!=='total' && this.selectedType=== 'total' )
      return this.regroupedData(data.filter(stat => (stat.status?.toLowerCase()) === this.selectedStatus));
      
    if(this.selectedType!=='total' && this.selectedStatus==='total')
      return this.regroupedData(data.filter(stat => (stat.type?.toLowerCase()) === this.selectedType));

    return this.regroupedData(data.filter(stat => (stat.type?.toLowerCase()) === this.selectedType).filter(stat => (stat.status?.toLowerCase()) === this.selectedStatus));
  }
   
  private getCount(data:DailyStatsDto[],date:String):number{
    let count=0;
    for(const d of data){
      if(d.date===date)
        count+=d.count ?? 0;
    }
    return count;
  }
  
  private processDailyData(data: DailyActionStatsDto[]): DailyAggregatedData[] {
    const results:DailyAggregatedData[]=[];

    const previousYearExists = data.some(d => {
      if (!d.date) return false;
      const dateObj = new Date(d.date);
      const prevYear = new Date();
      prevYear.setFullYear(dateObj.getFullYear() + 1);
      return data.some(dd => dd.date && new Date(dd.date).getFullYear() === dateObj.getFullYear() - 1);
    });

    const existingDates = new Set(data.map(d => d.date));

    for(const d of data){
      if (!d.date) continue; 
      
      const current = d.count ?? 0;
      
      let previous ;

      if (previousYearExists) {
        const dateObj = new Date(d.date);
        const previousYearDate = new Date(dateObj);
        previousYearDate.setFullYear(dateObj.getFullYear() - 1);
        const previousDateStr = previousYearDate.toISOString().slice(0, 10);
        previous = this.getPreviousVal(data, previousDateStr);
      }else{
        previous = null;
      }

      const aux: DailyAggregatedData = {
        date: d.date,
        current: current,
        previous: previous,
        thirdLine: (previous!==null) ? (current - previous) : null
      };
      results.push(aux);
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (!existingDates.has(todayStr)) {
      let previous: number =0;

      if (previousYearExists) {
        const todayDate = new Date();
        const previousYearDate = new Date(todayDate);
        previousYearDate.setFullYear(todayDate.getFullYear() - 1);
        const previousDateStr = previousYearDate.toISOString().slice(0, 10);
        previous = this.getPreviousVal(data, previousDateStr);
      }

      results.push({
        date: todayStr,
        current: 0,
        previous,
        thirdLine: previous !== null ? 0 - previous : null
      });
    }
    results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return results;
  }

  private getPreviousVal(data:DailyStatsDto[],date:String):number{
    for(const d of data){
      if (d.date && d.date.slice(0, 10) === date)
        return d.count ?? 0;
      }
    return 0;
  }
  
  public onStatusAndTypeChange(){
    this.filtredData=this.dailyStats;
    this.filtredData=this.filterDailyData(this.filtredData);
    this.dailyActionData=this.processDailyData(this.filtredData);
    this.results = this.getFilteredData(0);
  }
  
  public onPeriodChange() {
    this.weekOffset = 0;
    this.results = this.getFilteredData(0);
  }
  
  public previousWeek() {
    if (this.hasDataForWeek(this.weekOffset+1)) {
      this.weekOffset++;
      this.results = this.getFilteredData(this.weekOffset);
      this.goback = this.hasDataForWeek(this.weekOffset+1);
      this.gonext = this.weekOffset > 0;
    }
  }

  public nextWeek() {
    if (this.weekOffset > 0) {
      this.weekOffset--;
      this.results = this.getFilteredData(this.weekOffset);
      this.goback = this.hasDataForWeek(this.weekOffset+1);
      this.gonext = this.weekOffset > 0;
    }
  }

  private getFilteredData(offset: number) {
    const filtered = this.dailyActionData.map(d => ({
      ...d,
      parsedDate: new Date(d.date) 
    }));

    if (this.selectedPeriod === 'jour') {
      const today = new Date();
      const currentDay = today.getDay(); 
      const monday = new Date(today);
      const daysToMonday = currentDay === 0 ? 6 : currentDay - 1; 
      monday.setDate(today.getDate() - daysToMonday - offset * 7);

      const weekDates: Date[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        weekDates.push(day);
      }
      const result = weekDates.map(date => {
        const found = filtered.find(d => d.parsedDate.toDateString() === date.toDateString());
        const label = date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' });
          
        const isFuture = date > today;

        return {
          name: label,
            current: isFuture ? null : (found ? found.current : 0),
            previous: isFuture ? null : (found && typeof found.previous === 'number' ? found.previous : null),
            thirdLine: isFuture ? null : (found ? found.thirdLine : null)
          };
      });
      // Créer la série principale
      const series = [
        { name: `${today.getFullYear()}`, series: result.map(d => ({ name: d.name, value: d.current })) }
      ];

      // Vérifier si l'année précédente a des données
      const hasPreviousData = result.some(d => d.previous !== null);

      if (hasPreviousData) {
        series.push({ name: `${today.getFullYear() - 1}`, series: result.map(d => ({ name: d.name, value: d.previous })) });
        series.push({ name: 'Tendance', series: result.map(d => ({ name: d.name, value: d.thirdLine })) });
      }

      return series;

    }else if (this.selectedPeriod === 'mois') {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; 
      const previousYear = currentYear - 1;

      const yearMonthMap = new Map<number, Map<number, { current: number; previous: number; thirdLine: number }>>();

      // Remplir yearMonthMap
      for (const entry of filtered) {
        const year = entry.parsedDate.getFullYear();
        const month = entry.parsedDate.getMonth() + 1;

        if (!yearMonthMap.has(year)) {
          yearMonthMap.set(year, new Map());
        }
        const monthMap = yearMonthMap.get(year)!;

        if (!monthMap.has(month)) {
          monthMap.set(month, { current: 0, previous: 0, thirdLine: 0 });
        }

        const val = monthMap.get(month)!;
        val.current += entry.current;
        val.previous += entry.previous ? entry.previous : 0;
        val.thirdLine += entry.thirdLine ? entry.thirdLine : 0;
      }

      // Filtrer les années disponibles
      const filteredYears = [currentYear, previousYear].filter(y => yearMonthMap.has(y));

      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

      // Créer la série principale en ignorant les mois futurs
      const currentSeries = filteredYears.map(year => ({
        name: `${year}`,
        series: monthNames.map((label, i) => {
          const monthIndex = i + 1;
          const val = yearMonthMap.get(year)!.get(monthIndex);
          if (year === currentYear && monthIndex > currentMonth) {
            return { name: label, value: null };
          }
          return { name: label, value: val ? val.current : 0 };
        })
      }));

      // Créer la tendance uniquement si previousYear existe
      let tendanceSeries: typeof currentSeries = [];
      if (yearMonthMap.has(previousYear)) {
        const tendanceParMois = Array(12).fill(0);
        for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
          for (const year of filteredYears) {
            const val = yearMonthMap.get(year)!.get(monthIndex);
            if (val) {
              // Si c'est l'année en cours et le mois futur, ignorer
              if (year === currentYear && monthIndex > currentMonth) continue;
              tendanceParMois[monthIndex - 1] += val.thirdLine;
            }
          }
        }

        tendanceSeries = [
          {
            name: 'Tendance',
            series: monthNames.map((label, i) => ({
              name: label,
              value: tendanceParMois[i]
            }))
          }
        ];
      }

      return [...currentSeries, ...tendanceSeries];

    }else if (this.selectedPeriod === 'annee') {
      const yearMap = new Map<number, { current: number; previous: number; thirdLine: number }>();

      for (const entry of filtered) {
        const year = entry.parsedDate.getFullYear();
        if (!yearMap.has(year)) {
          yearMap.set(year, { current: 0, previous: 0, thirdLine: 0 });
        }
        const y = yearMap.get(year)!;
        y.current += entry.current;
        y.previous += entry.previous ? entry.previous : 0;
        y.thirdLine += entry.thirdLine ? entry.thirdLine : 0 ;
      }

      const sortedYears = Array.from(yearMap.keys()).sort();

      return [
        {
          name: `Total annuel`,
          series: sortedYears.map(y => ({
            name: `${y}`,
            value: yearMap.get(y)!.current
          }))
        }
      ];
    }

    return []; 
  }

  private getActionDistribution(data: DailyActionStatsDto[]): ActionDistribution[] {
    const types: string[] = ['tri', 'recyclage', 'compostage', 'nettoyage', 'plantation'];
    const results: ActionDistribution[] = [];

    for (const type of types) {
      const aux = data.filter(stat => stat.type?.toLowerCase() === type);
      const count = aux.reduce((acc, el) => acc + (el.count ?? 0), 0);
      results.push({ name: type, value: count });
    }
    return results;
  }

  private hasDataForWeek(weekOffset: number): boolean {
    if (!this.dailyActionData || this.dailyActionData.length === 0) return false;

    const today = new Date();
    const currentDay = today.getDay(); 
    const monday = new Date(today);
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    monday.setDate(today.getDate() - daysToMonday - weekOffset * 7);

    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDates.push(day.toISOString().slice(0, 10));
    }

    return this.dailyActionData.some(d => weekDates.includes(d.date));
  }

}

 
