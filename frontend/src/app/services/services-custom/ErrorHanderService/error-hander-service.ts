import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';

export interface BackendError {
  code?: string;
  httpCode?: number;
  message?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private toastr: ToastrService, private router: Router) {}

  public handle(error: HttpErrorResponse): Observable<never> {
    let errorMsg = 'Une erreur est survenue. Réessayez plus tard.';

    let backendError: any = error.error;

    // Si le backend renvoie une chaîne JSON, on la parse
    if (typeof backendError === 'string') {
      try {
        backendError = JSON.parse(backendError);
      } catch (e) {
        this.toastr.error(errorMsg,'Erreur');
      }
    }

    // Lecture du message du backend
    if (backendError && backendError.message) {
      errorMsg = backendError.message;
    }

    // Cas où l'utilisateur n'est pas authentifié
    if (error.status === 401) {
      this.toastr.error(errorMsg, 'Non autorisé');
      this.router.navigate(['login']);
      return throwError(() => new Error('UNAUTHORIZED'));
    }

    // Cas où le serveur n'est pas accessible
    if (error.status === 0) {
      errorMsg = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    }

    // Cas général pour toutes les autres erreurs
    this.toastr.error(errorMsg, 'Erreur');

    return throwError(() => new Error(errorMsg));
  }
}
