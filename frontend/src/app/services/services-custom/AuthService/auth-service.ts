import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { TokenService } from '../../token/token.service';
import { AdminControllerService, AuthenticationControllerService, ClientControllerService, LogOutControllerService, UserControllerService  } from '../../services';
import { AuthenticationResponse } from '../../models';
import { User } from '../../../models/types';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../ErrorHanderService/error-hander-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authApi: AuthenticationControllerService,
    private tokenService: TokenService,
    private clientApi: ClientControllerService,
    private adminApi :AdminControllerService,
    private userApi : UserControllerService,
    private logoutApi : LogOutControllerService,
    private  toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
    private router : Router
  ) {}

  public login(mail: string, password: string): Observable<void> {
    console.log("login");
    return this.authApi.authenticate({ body: { mail, password } }).pipe(
      tap(response => {
        if (response.access_token && response.refresh_token) {
          localStorage.setItem("isLoggedIn", "true");
          this.tokenService.setAccessToken(response.access_token);
          this.tokenService.setRefreshToken(response.refresh_token);
          this.startTokenTimer();
        } else {
          this.toastr.error("Une erreur est survenue. Réessayez plus tard.", 'Erreur');
        }
      }),
      map(() => void 0),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public register(city: string, mail: string, password: string, userName: string): Observable<void> {
    return this.authApi.registreClient({
      body: { city, mail, password, userName }
    }).pipe(
      tap(response => {
        if (response.access_token && response.refresh_token) {
          this.tokenService.setAccessToken(response.access_token);
          this.tokenService.setRefreshToken(response.refresh_token);
          this.startTokenTimer();
        } else {
          this.toastr.error("Une erreur est survenue. Réessayez plus tard.", 'Erreur');
        }
      }),
      map(() => void 0),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public verifyUser(mail: string, verificationCode: number): Observable<string> {
    return this.userApi.verifyUser({ body: { mail, verificationCode } }).pipe(
      map(response => response ?? ''),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public resendVerificationCode(mail: string): Observable<string> {
    return this.userApi.resendVerificationCode({ body: { mail } }).pipe(
      map(response => response ?? ''),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.tokenService.clear?.();
      this.toastr.info('Votre session a expiré. Veuillez vous reconnecter.');
      this.router.navigate(['login']);
      return throwError(() => new Error('SESSION_EXPIRED'));
    }

    return this.authApi.refreshToken().pipe(
      map(response => response ?? { access_token: '', refresh_token: '' }),
      catchError(err => {
        this.tokenService.clear?.();
        this.toastr.info('Votre session a expiré. Veuillez vous reconnecter.');
        this.router.navigate(['/login']);
        return throwError(() => new Error('SESSION_EXPIRED'));
      })
    );
  }

  public getRole(): string | undefined {
    return this.tokenService.getuserRole();
  }

  public getUser(): Observable<User | null> {
    const userId = this.tokenService.getUserId();
    if (!userId) return of(null);

    if (this.getRole() === 'CLIENT') {
      return this.clientApi.getClientDetails({ id: userId }).pipe(
        map(client => ({
          userName: client.userName ?? '',
          mail: client.mail ?? '',
          totalPoints: client.totalPoints ?? 0,
          city: client.city ?? ''
        })),
        catchError(err => this.errorHandler.handle(err))
      );
    } else {
      return this.adminApi.getAdminInformation({ id: userId }).pipe(
        map(admin => ({
          userName: admin.userName ?? '',
          mail: admin.mail ?? '',
          totalPoints: 0,
          city: ''
        })),
        catchError(err => this.errorHandler.handle(err))
      );
    }
  }

  public sendResetMail(mail: string): Observable<string> {
    return this.authApi.resetPassword({ body: { mail } }).pipe(
      map(response => response ?? ''),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  public resetPassword(mail: string, password: string): Observable<string> {
    return this.userApi.updatePassword({ body: { mail, password } }).pipe(
      map(response => response ?? ''),
      catchError(err => this.errorHandler.handle(err))
    );
  }

  private startTokenTimer() {
    console.log("timer");
    const exp = this.tokenService.getExpiration() * 1000;
    const now = Date.now();
    const timeout = exp - now - 120000;

    if (timeout > 0) {
      setTimeout(() => {
        this.refreshToken().subscribe(newTokens => {
          if (newTokens.access_token && newTokens.refresh_token) {
            this.tokenService.setAccessToken(newTokens.access_token);
            this.tokenService.setRefreshToken(newTokens.refresh_token);
            this.startTokenTimer();
          }
        });
      }, timeout);
    }
  }

  public logout(): Observable<void> {
    return this.logoutApi.logOut().pipe(
      tap(() => {
        this.tokenService.clear();
      }),
      catchError(err => this.errorHandler.handle(err))
    );
  }
}