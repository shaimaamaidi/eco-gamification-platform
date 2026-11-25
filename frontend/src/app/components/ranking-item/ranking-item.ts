import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ranking-item',
  standalone : true,
  imports: [CommonModule],
  templateUrl: './ranking-item.html',
  styleUrl: './ranking-item.css'
})
export class RankingItem {
  @Input() client!: {
    id: number;
    name: string;
    points: number;
    rank: number;
    profileImage?: string;
  };

  @Input() isCurrentUser: boolean = false;

  public get avatarFallback(): string {
    return this.client?.name?.charAt(0) || '?';
  }
  
  public get hasImage(): boolean {
    return !!this.client?.profileImage;
  }
}
