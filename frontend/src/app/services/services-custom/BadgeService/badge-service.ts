import { Injectable } from '@angular/core';
import { BadgeControllerService } from '../../services';
import { BadgeDto } from '../../models';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  constructor(private badgesApi: BadgeControllerService,private errorHandler: ErrorHandlerService){}
  
  public addBadge(badge: BadgeDto): Observable<string> {
    return this.badgesApi.addBadge({ body: badge }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public deleteBadge(id: number): Observable<string> {
    return this.badgesApi.deleteBadge({ id }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public updateBadge(idBadge: number, badgeDto: BadgeDto): Observable<string> {
    return this.badgesApi.updateBadge({ id:idBadge, body: badgeDto }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }
}
