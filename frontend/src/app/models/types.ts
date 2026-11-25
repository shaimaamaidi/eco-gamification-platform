export interface MenuItem{
  id:string;
  name: string,
  title:string,
  label:string;
  icon:string;
}

export interface User {
  userName: string;
  mail: string;
  totalPoints: number;
  city:string;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export type RankingType = 'global' | 'by_Action' | 'by_City';
export type ActionType= 'tous' | 'tri' | 'recyclage' | 'compostage' | 'nettoyage' | 'plantation';

export interface ClientRanking {
  id: number;
  name: string;
  points: number;
  rank: number;
}



