import { Injectable } from '@angular/core';
import { RecompenseControllerService } from '../../services';
import { RecompenseDto } from '../../models';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';

@Injectable({
  providedIn: 'root'
})
export class RecompenseService {
  
  constructor(private recompenseApi: RecompenseControllerService,private errorHandler: ErrorHandlerService) {}
  
  public addRecompense(recompense: RecompenseDto): Observable<string> {
    return this.recompenseApi.addRecompense({ body: recompense }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public updateRecompense(id: number, recompense: RecompenseDto): Observable<string> {
    return this.recompenseApi.updateRecompense({ id, body: recompense }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public deleteRecompense(id: number): Observable<string> {
    return this.recompenseApi.deleteRecompense({ id }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }
}
