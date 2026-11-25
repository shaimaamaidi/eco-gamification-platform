import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() {}
  getErrorMessage(errorDto: any): string {
    if (!errorDto || !errorDto.code) {
      return 'Une erreur inattendue est survenue.';
    }

    switch (errorDto.code) {
      // ----- ACTION -----
      case 'ACTION_NOT_VALID': return 'L’action n’est pas valide.';
      case 'ACTION_NOT_FOUND': return 'L’action demandée est introuvable.';
      case 'ACTION_ALREADY_EXISTS': return 'Cette action existe déjà.';

      // ----- USER / CLIENT -----
      case 'USER_NOT_VALID': return 'Utilisateur invalide.';
      case 'USER_NOT_FOUND': return 'Utilisateur introuvable.';
      case 'CLIENT_NOT_FOUND': return 'Client introuvable.';
      case 'ADMIN_NOT_FOUND': return 'Administrateur introuvable.';
      case 'ADMIN_ALREADY_EXISTS': return 'Administrateur déjà existant.';
      case 'ADRESSE_MAIL_NOT_FOUND': return 'Adresse mail introuvable.';
      case 'ADRESSE_MAIL_ALREADY_EXISTS': return 'Adresse mail déjà utilisée.';
      case 'INVALID_PASSWORD': return 'Mot de passe invalide.';

      // ----- RECOMPENSE / BADGE / CHALLENGE -----
      case 'RECOMPENSE_NOT_VALID': return 'Récompense invalide.';
      case 'RECOMPENSE_NOT_FOUND': return 'Récompense introuvable.';
      case 'NAME_ALREADY_EXISTS': return 'Nom déjà utilisé.';
      case 'INSUFFICIENT_POINTS': return 'Points insuffisants.';
      case 'BADGE_NOT_VALID': return 'Badge invalide.';
      case 'BADGE_NOT_FOUND': return 'Badge introuvable.';
      case 'CHALLENGE_NOT_VALID': return 'Challenge invalide.';
      case 'CHALLENGE_NOT_FOUND': return 'Challenge introuvable.';

      // ----- AUTRES -----
      case 'TITLE_ALREADY_EXISTS': return 'Le titre existe déjà.';
      case 'DATE_NOT_VALID': return 'Date invalide.';
      case 'BAD_CREDENTIALS': return 'Email ou mot de passe incorrect.';
      case 'INTERNAL_ERROR': return 'Erreur serveur interne.';

      default: return errorDto.message || 'Une erreur est survenue.';
    }
  }
}

