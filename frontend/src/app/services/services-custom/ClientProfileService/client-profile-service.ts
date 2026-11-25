import { Injectable } from '@angular/core';
import { ClientControllerService, ClientProfileControllerService } from '../../services';
import { catchError, map, Observable } from 'rxjs';
import { ActionDto, BadgeDto, ChallengeDto, ClientDto, RecompenseDto } from '../../models';
import { User } from '../../../models/types';
import { UserStatsSummaryDto } from '../../models/user-stats-summary-dto';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {
  constructor(
    private clientApi : ClientProfileControllerService,
    private clientApiCentre: ClientControllerService,
    private errorHandler: ErrorHandlerService
  ){}
  
  public getUser(userId :number): Observable<User | null> {
    const client=this.clientApiCentre.getClientDetails({ id: userId });
    return client.pipe(
      map(client => ({
        userName: client.userName?? '',
        mail: client.mail ?? '',
        totalPoints: client.totalPoints ?? 0,
        city: client.city ?? ''
      })),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getStats(idClient: number) :Observable<UserStatsSummaryDto> {
    return this.clientApi.getAchievementsStats({ idClient }).pipe(
      map(response => response ?? { badgesLocked: 0, challengesCompleted: 0, recompensesAchieved: 0 }),
      catchError(err => this.errorHandler.handle(err))
    );
  }
  
  public getAllctions(idClient: number): Observable<ActionDto[]> {
    return this.clientApi.getActionsByClient({ idClient }).pipe(
      map(response => response ?? []),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getAllRecompenses(idClient: number): Observable<RecompenseDto[]> {
    return this.clientApi.getAllRecompenses({ idClient }).pipe(
      map(response => response ?? []),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getChallenges(idClient: number): Observable<ChallengeDto[]> {
    return this.clientApi.getCurrentChallengesWithProgress({ idClient }).pipe(
      map(response => response ?? []),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public getBadges(idClient: number): Observable<BadgeDto[]> {
    return this.clientApi.getAllBadgesWithProgress({ idClient }).pipe(
      map(response => response ?? []),
      catchError(err => this.errorHandler.handle(err))
    );
  }
  
  public updateClient(idClient: number, newClient:ClientDto): Observable<string> {
    return this.clientApiCentre.updateClient({
      id: idClient,
      body: newClient
    }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }
}
