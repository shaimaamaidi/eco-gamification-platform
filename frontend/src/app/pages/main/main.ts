import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBar } from "../../components/side-bar/side-bar";
import { Notification } from "../../components/notification/notification";
import {MenuItem, User} from '../../models/types';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/services-custom/SharedService/shared-service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoadingDots } from "../../components/loading-dots/loading-dots";



@Component({
  selector: 'app-main',
  standalone : true,
  imports: [CommonModule, SideBar, Notification, RouterModule, RouterOutlet, LoadingDots],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit{
  public isAdmin=false;
 
  public isMobile = window.innerWidth < 800;
  public isSidebarExpanded = true;

  private currentUser: User | null = null;


  public menuItems:MenuItem[]=[];
  public currentSection={ id: 'Dashboard', title: "", label: "", icon: "" };
  public isLoadingData : boolean=true;

  constructor(private sharedService: SharedService,private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoadingData=true;
    this.isAdmin=(this.authService.getRole()=="ADMIN");
    this.sharedService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if(this.isAdmin){
          this.menuItems= [
            { id: 'admin/dashboard',name:'dashboard', title: `Bonjour, ${this.currentUser.userName}`, label: "Vue d'ensemble et statistiques", icon: "/assets/dashboard.svg" },
            { id: 'profile',name:'Profile', title: 'Mon Profil', label: 'Gérez vos informations administrateur', icon: "/assets/profile_2.svg" },
            { id: 'admin/clients',name:'Clients', title: 'Clients', label: 'Consultez le classement et les informations des utilisateurs', icon: "/assets/users.svg" },
            { id: 'admin/actions',name:'Actions', title: 'Actions', label: 'Supervisez et validez les actions écologiques', icon: "/assets/action.svg" },
            { id: 'admin/badges',name:'Badges', title: 'Badges', label: 'Créez, modifiez et suivez les badges', icon: "/assets/badge.svg" },
            { id: 'admin/challenges',name:'Défis', title: 'Défis', label: 'Créez, modifiez et suivez les défis', icon: "/assets/challenge.svg" },
            { id: 'admin/recompenses',name:'Récompenses', title: 'Récompenses', label: 'Créez, modifiez et suivez les récompenses', icon: "/assets/recompense.svg" }
          ];
        }else{
          this.menuItems= [
            { id: 'dashboard',name:'dashboard', title: `Bonjour, ${this.currentUser.userName}`,label:"Suivez vos progrès écologiques", icon: "/assets/dashboard.svg" },
            { id: 'profile',name:'Profile', title: 'Mon Profil', label: 'Gérez votre profil et vos paramètres', icon: "/assets/profile_2.svg" },
            { id: 'actions',name:'Actions',  title: 'Actions',label: 'Gérez vos actions pour la planète', icon:"/assets/action.svg"  },
            { id: 'badges',name:'Badges', title: 'Badges',label: 'Débloquez de nouveaux badges', icon: "/assets/badge.svg" },
            { id: 'challenges',name:'Défis',title: 'Défis', label: 'Relevez des défis écologiques', icon: "/assets/challenge.svg"  },
            { id: 'recompenses',name:'Récompenses', title: 'Récompenses',label: 'Réclamez vos récompenses', icon: "/assets/recompense.svg"  },
          ];
        }
        const currentPath = this.router.url.split('/').pop() || '';
        const found = this.menuItems.find(item => currentPath.includes(item.id));
        this.currentSection = found || this.menuItems[0];
        this.isLoadingData=false;
    });
    this.isMobile = window.innerWidth < 800;
  }

  @HostListener('window:resize')
  public onResize() {
    this.isMobile = window.innerWidth < 800;
  }

  public openSidebar() {this.isSidebarExpanded = true;}

  public closeSidebar() {this.isSidebarExpanded = false}

  public setCurrentSection(id:string) {
    const found = this.menuItems.find(item => item.id === id);
    
    if (found) {
      this.currentSection = found;
    }else{
      this.currentSection=this.menuItems[0]; 
    }
  }
  
  public logout(){
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(["login"]);
      }
    });
  }
}

