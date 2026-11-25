import { Injectable } from '@angular/core';
import { AdminStatsControllerService } from '../../services';
import { catchError, map, Observable } from 'rxjs';
import { ActionDto, BadgeDto, ChallengeDto, ClientDto, DailyActionStatsDto, DailyStatsDto, RecompenseDto } from '../../models';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';

@Injectable({
  providedIn: 'root'
})
export class AdminStatsService {
  
  constructor(private statsApi : AdminStatsControllerService,private errorHandler: ErrorHandlerService) {}
  
  public countClients(): Observable<number> {
    return this.statsApi.countAllClients().pipe(
      map(response => response ?? 0),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getClientsTodayAndYesterday(): Observable<DailyStatsDto[]> {
    return this.statsApi.getClientsTodayAndYesterday().pipe(
      map(response => response ?? []),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public countEnabledClientsToday(): Observable<number> {
    return this.statsApi.getEnabledClientsTodayAndYesterday().pipe(
      map(response => response ?? 0),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public countActiveClientsLast7Days(): Observable<number> {
    return this.statsApi.getActiveClientsLast7Days().pipe(
      map(response => response ?? 0),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getCumulativeClients(): Observable<DailyStatsDto[]> {
    return this.statsApi.getCumulativeClients().pipe(
      map(response => response ?? []) ,
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getAllActions(): Observable<Array<ActionDto>> {
    return this.statsApi.getAllActions().pipe(
      map(response => response ?? []) ,
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getDailyActionStats(): Observable<DailyActionStatsDto[]> {
    return this.statsApi.getDailyActionStats().pipe(
      map(response => response ?? []) ,
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getRecompenses(): Observable<Array<RecompenseDto>> {
    return this.statsApi.getAllRecompenses1().pipe(
      map(response => response ?? []) ,
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getRecompenseSuccessRate(): Observable<number> {
    return this.statsApi.getRecompenseSuccessRate().pipe(
      map(response => response ?? 0) ,
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getBadges(): Observable<Array<BadgeDto>> {
    return this.statsApi.getAllBadges().pipe(
      map(response => response ?? []) ,
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getBadgeSuccessRate(): Observable<number> {
    return this.statsApi.getBadgeSuccessRate().pipe(
      map(response => response ?? 0),
      catchError(err => this.errorHandler.handle(err)) 
    );
  }

  public getChallenges(): Observable<Array<ChallengeDto>> {
    return this.statsApi.getAllChallenges().pipe(
      map(response => response ?? []),
      catchError(err => this.errorHandler.handle(err)) 
    );
  }

  public getChallengeSuccessRate(): Observable<number> {
    return this.statsApi.getChallengeSuccessRate().pipe(
      map(response => response ?? 0),
      catchError(err => this.errorHandler.handle(err)) 
    );
  }
}
