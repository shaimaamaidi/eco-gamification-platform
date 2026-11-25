import { Injectable } from '@angular/core';
import {  ChallengeControllerService } from '../../services';
import { ChallengeDto } from '../../models';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  
  constructor(private challengeApi : ChallengeControllerService,private errorHandler: ErrorHandlerService){}

  public addChallenge(challenge: ChallengeDto): Observable<string> {
    return this.challengeApi.addChallenge({ body: challenge }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }
  
  public updateChallenge(id: number, challenge: ChallengeDto): Observable<string> {
    return this.challengeApi.updateChallenge({ id, body: challenge }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public deleteChallenge(id: number): Observable<string> {
    return this.challengeApi.deleteChallenge({ id }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }
}
