import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DailyStatsDto } from '../../services/models';
import { AdminStatsService } from '../../services/services-custom/AdminStatsService/admin-stats-service';
import { forkJoin } from 'rxjs';
import { LoadingDots } from "../loading-dots/loading-dots";

interface DailyAggregatedData {
  date: string;
  current: number;
  previous: number | null ;
  thirdLine: number | null;
}
interface clientDistribution{
  name:string;
  value:number;
}

@Component({
  selector: 'app-client-stats-section',
  standalone : true,
  imports: [CommonModule, NgxChartsModule, FormsModule, LoadingDots],
  templateUrl: './client-stats-section.html',
  styleUrl: './client-stats-section.css'
})
export class ClientStatsSection implements OnInit{
  @Input()isLoadingAll : boolean=true;

  @Output()onChildLoaded = new EventEmitter<void>();
  @Output()finishChildLoad = new EventEmitter<void>();

  private dailyStats : DailyStatsDto[] = [];
  private data: DailyStatsDto[] = [];
  public totalClients: number = 0;
  public nbreEnabledClient:number=0;
  private unverifiedClients:number=0;
  public activeClientsLast7Days : number =0;
  public newClientsAbsolute: number = 0;
  public newClientsChange: number = 0;
  public selectedPeriod: 'jour' | 'mois' | 'annee' = 'jour';
  private weekOffset = 0;
  private dailyClientData :DailyAggregatedData[]=[];
  public results: {  
      name: string;
      series: {
        name: string;
        value: number | null;
      }[];
  }[] = [];
  
  public clientDistributionData :clientDistribution[] = [];
  public customClientColors: { name: string; value: string }[] = [];
  public goback:boolean=false;
  public gonext:boolean=false;

  constructor(private adminStatsService : AdminStatsService){}

  ngOnInit() {
    this.onChildLoaded.emit();
    this.loadStats();
  }

  private loadStats():void{
    forkJoin({
      dailyStats: this.adminStatsService.getClientsTodayAndYesterday(),
      cumulativeClients: this.adminStatsService.getCumulativeClients(),
      totalClients: this.adminStatsService.countClients(),
      enabledClientsToday: this.adminStatsService.countEnabledClientsToday(),
      activeClientsLast7Days: this.adminStatsService.countActiveClientsLast7Days()
    }).subscribe({
      next: (results) => {
        // Daily stats
        this.dailyStats = results.dailyStats;
        this.calculateStats();

        // Cumulative clients
        this.data = results.cumulativeClients;
        this.dailyClientData = this.processDailyData(this.data);
        this.results = this.getFilteredData(0);

        this.goback = this.hasDataForWeek(this.weekOffset+1);
        this.gonext=false;

        // Count clients
        this.totalClients = results.totalClients;

        // Enabled clients today
        this.nbreEnabledClient = results.enabledClientsToday;
        this.unverifiedClients = this.totalClients - this.nbreEnabledClient;

        if (this.nbreEnabledClient !== 0 || this.unverifiedClients !== 0) {
          this.clientDistributionData = [
            { name: 'Vérifiés', value: this.nbreEnabledClient },
            { name: 'Non vérifiés', value: this.unverifiedClients }
          ];
          this.customClientColors = [
            { name: 'Vérifiés', value: 'hsl(142.1 76.2% 36.3%)' },
            { name: 'Non vérifiés', value: 'hsl(217.2 91.2% 59.8%)' }
          ];
        } else {
          this.clientDistributionData = [
            { name: 'Aucun client', value: 1 }
          ];
          this.customClientColors = [
            { name: 'Aucun client', value: '#E5E7EB' }
          ];
        }

        // Active clients last 7 days
        this.activeClientsLast7Days = results.activeClientsLast7Days;
        this.finishChildLoad.emit();
      },
      error: (err) => {
        this.finishChildLoad.emit();
      }
    });
  }

  private calculateStats() {
    const yesterday = this.dailyStats[0];
    const today = this.dailyStats[1];

    if (today?.count !== undefined && yesterday?.count !== undefined) {
      this.totalClients=today.count;
      this.newClientsAbsolute = Math.abs(today.count - yesterday.count);
      this.newClientsChange = (yesterday.count!==0) ? (Number(
        (((today.count - yesterday.count) / yesterday.count) * 100).toFixed(2)
      )) : 100;
    }
  }

  private processDailyData(data: DailyStatsDto[]): DailyAggregatedData[] {
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

  private getPreviousVal(data:DailyStatsDto[],date:String):number {
    for(const d of data){
      if(d.date===date)
        return d.count ?? 0;
    }
    return 0;
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
   private safeDivide = (value: number) => this.totalClients !== 0 ? value / this.totalClients : 0;

  private getFilteredData(offset: number) {
    const filtered = this.dailyClientData.map(d => ({
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
            current: isFuture ? null : (found ? this.safeDivide(found.current) : 0),
            previous: isFuture ? null : (found && typeof found.previous === 'number' ? this.safeDivide(found.previous) : null),
            thirdLine: isFuture ? null : (found && typeof found.thirdLine === 'number' ? this.safeDivide(found.thirdLine) : null)
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

  private hasDataForWeek(weekOffset: number): boolean {
    if (!this.dailyClientData || this.dailyClientData.length === 0) return false;

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

    return this.dailyClientData.some(d => weekDates.includes(d.date));
  }

}

