import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../models/types';
import { AuthService } from '../AuthService/auth-service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private currentUserSource = new BehaviorSubject<User>({
    userName: '',
    mail: '',
    totalPoints: 0,
    city: ''
  });

  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private authService: AuthService) {
    this.loadCurrentUser();
  }

  public loadCurrentUser() {
    this.authService.getUser().subscribe(u => {
      if (u != null) {
        this.currentUserSource.next(u);
      }
    });
  }

  public getCurrentUserValue(): User {
    return this.currentUserSource.value;
  }
}
 