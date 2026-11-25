import { Injectable } from '@angular/core';
import { ClassementControllerService } from '../../services';
import { catchError, map, Observable } from 'rxjs';
import { ClientDto } from '../../models';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';

@Injectable({
  providedIn: 'root'
})
export class ClassementService {
  constructor(private classementApi : ClassementControllerService,private errorHandler: ErrorHandlerService){}

  public getClientsWithClassements(): Observable<ClientDto[]> {
    return this.classementApi.getClientsWithClassements().pipe(
      map(response => response ?? []),
      catchError(err => this.errorHandler.handle(err))
    );
  }
}
