import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MenuItem, User } from '../../models/types';
import { SharedService } from '../../services/services-custom/SharedService/shared-service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone : true,
  imports: [CommonModule, RouterLink,RouterModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar implements OnInit{
  @Input()isAdmin: boolean=false; 
  @Input() isExpanded = true;
  @Input() menuItems:MenuItem[]=[];
  @Input() currentSection= { id: 'dashboard',name:'dashboard', title: "", label: "", icon: "" };

  @Output() openSidebar = new EventEmitter<void>();
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() sectionChange = new EventEmitter<string>();

  public isMobile:boolean =window.innerWidth < 800;
  private touchStartX = 0;
  private touchEndX = 0;
  private isClosed = false;

  public currentUser : User | null = null;
  
  constructor(private sharedService: SharedService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 800;
     this.sharedService.currentUser$.subscribe(u => {
      this.currentUser = u;
    });
  }

  @HostListener('window:resize')
  public onResize() {
    const previous = this.isMobile;
    this.isMobile = window.innerWidth < 800;
    if (this.isMobile !== previous) {
      this.cdr.detectChanges();
    }
  } 

  @HostListener('touchstart', ['$event'])
  public onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX; 
  }

  @HostListener('touchend', ['$event'])
  public onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  public onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'width') {
      this.isClosed = !this.isExpanded;
    }
  }

  public getSidebarClasses(): string {
    if (this.isExpanded) {
      return 'w-64 bg-gradient-to-b from-emerald-600 to-emerald-800';
    } 
    else if (!this.isMobile && !this.isExpanded) {
      return 'w-20 bg-gradient-to-b from-emerald-600 to-emerald-800';
    } 
    else if (this.isMobile && !this.isExpanded) {
      if (this.isClosed) {
        return 'w-2 bg-[#DCFCE7]';
      } else {
        return 'w-2 bg-gradient-to-b from-emerald-600 to-emerald-800';
      }
    }
    return '';
  }

  public getToggleButtonPositionClass(): string {
    if (!this.isMobile && this.isExpanded) return '-right-3 top-24';
    if (!this.isMobile && !this.isExpanded) return '-right-4 top-24';
    return '';
  }


  private handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const threshold = 50; 
    if (!this.isMobile) return
    if (deltaX < -threshold && this.isExpanded) {
      this.close();
    } else {
      this.open(); 
    }
  }

  public open() { this.openSidebar.emit();}

  public close() {this.closeSidebar.emit();}
  
  public onSelectSection(item:MenuItem) {
    this.sectionChange.emit(item.id);
    this.close();
  }
    
  public getRouterLink(item: any): any[] {
    return ['/main', ...((item.id && typeof item.id === 'string') ? item.id.split('/') : [item.id])];
  }
}
