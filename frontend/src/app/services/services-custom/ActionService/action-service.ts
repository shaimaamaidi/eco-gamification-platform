import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ActionDto } from '../../models';
import { ActionControllerService } from '../../services';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(private actionApi : ActionControllerService,private errorHandler: ErrorHandlerService) {}

  public rejectAction(id: number, actionDto: ActionDto): Observable<string> {
    return this.actionApi.rejectAction({ id, body: actionDto }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public acceptAction(id: number): Observable<string> {
    return this.actionApi.acceptAction({ id }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }
  
  public addAction(idClient: number, actionDto?: ActionDto): Observable<string> {
    return this.actionApi.addAction({ idClient, body: actionDto }).pipe(
      map(response => response ?? ""),
      catchError(err => this.errorHandler.handle(err))
    );
  }
} 
