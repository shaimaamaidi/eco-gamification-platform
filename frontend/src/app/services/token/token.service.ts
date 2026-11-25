import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private jwtHelper = new JwtHelperService();

  public setAccessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public setRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public isAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  public isRefreshTokenValid(): boolean {
    const token = this.getRefreshToken();
    if (!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getuserRole(): string | undefined  {
    const token = this.getAccessToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.role ;
    }
    return undefined ;
  }

  public getUserId():number | undefined {
    const token = this.getAccessToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.user_id;
    }
    return undefined;
  }

  public getMail():string | undefined {
    const token = this.getAccessToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.sub ;
    }
    return undefined ;
  }

  public getExpiration():number{
    const token = this.getRefreshToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.exp || 0;
    }
    return 0;
  }

  public clear(): void {
    this.setAccessToken('');
    this.setRefreshToken('');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  
}
