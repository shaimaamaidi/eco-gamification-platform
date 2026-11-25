import { Component } from '@angular/core';
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Feature {
  icon: string
  title: string
  description: string
}

interface Action {
  icon: string
  name: string
  points: string
}

interface Challenge {
  icon:String,
  title: string
  description: string
  bgColor: string
  badgeColor: string
}

interface Badge {
  icon:String,
  title: string
  description: string
  points: string
  bgColor: string
  badgeColor: string
}

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [Footer, Header,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private router: Router) {}

  public features: Feature[] = [
    {
      icon: "/assets/acceuil1.jpg",
      title: "Déclaration d'Actions",
      description:
        "Photographiez vos gestes écologiques : tri, recyclage, compostage, plantation d'arbres, nettoyage d'espaces publics."    },
    {
      icon: " /assets/acceuil4.jpg",
      title: "Validation Authentique",
      description:
        "Chaque action est vérifiée par nos administrateurs pour garantir l'authenticité de vos contributions environnementales."
    },
    {
      icon: "/assets/acceuil2.png",
      title: "Points & Badges",
      description:
        "Gagnez des points selon vos actions et débloquez des badges exclusifs en atteignant des paliers spécifiques."
    },
    {
      icon: "/assets/acceuil3.jpg",
      title: "Défis Périodiques",
      description:
        "Participez à des défis comme 'Semaine Verte' ou 'Objectif Zéro Plastique' pour maximiser votre impact."
    },
  ]

  public actions: Action[] = [
    { icon: "🗑️", name: "Tri des déchets", points: "10 pts" },
    { icon: "♻️", name: "Recyclage", points: "15 pts" },
    { icon: "🍃", name: "Nettoyage public", points: "30 pts" },
    { icon: "🌱", name: "Compostage", points: "45 pts" },
    { icon: "🌲", name: "Plantation d'arbres", points: "40 pts" },
  ]

  public challenges: Challenge[] = [
    {
      icon:"♻️",
      title: "Champion du Tri",
      description: "Atteignez 250 points en triant vos déchets",
      bgColor: "from-green-100 to-green-50 border-green-300",
      badgeColor: "bg-green-600 text-white",
    },
    {
      icon:"🧹",
      title: "Expert Plantation",
      description: "Atteignez 400 points en plantant des arbres",
      bgColor: "from-blue-100 to-blue-50 border-blue-200",
      badgeColor: "bg-blue-600 text-white",
    },
    
  ]

  public badges: Badge[] = [
    {
      icon: "🏅",
      title: "Héros Vert",
      description: "Cumul de 1000 points dans toutes vos actions",
      points: "+1000 pts",
      bgColor: "from-purple-100 to-purple-50 border-purple-200",
      badgeColor: "bg-purple-600 text-white",
    },
    {
      icon: "🏆",
      title: "Ambassadeur Écologique",
      description: "Cumul de 2000 points ou plus dans toutes vos actions  ",
      points: "+2000 pts",
      bgColor: "from-orange-100 to-orange-50 border-orange-200",
      badgeColor: "bg-orange-500 text-white",
    },
    
  ];

  public goToLogin(): void {
    this.router.navigate(['/login']);
  }

  public goToSignUp(): void {
    this.router.navigate(['/signup']);
  }
  
  public scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }
}
