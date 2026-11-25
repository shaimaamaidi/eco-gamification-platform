import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Signup } from './pages/signup/signup';
import { EmailVerification } from './pages/email-verification/email-verification';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Main } from './pages/main/main';
import { AdminDashboardSection } from './components/admin-dashboard-section/admin-dashboard-section';
import { ClientDashboardSection } from './components/client-dashboard-section/client-dashboard-section';
import { ProfileSection } from './components/profile-section/profile-section';
import { ActionSection } from './components/action-section/action-section';
import { AdminBadgeSection } from './components/admin-badge-section/admin-badge-section';
import { ClientBadgeSection } from './components/client-badge-section/client-badge-section';
import { AdminChallengeSection } from './components/admin-challenge-section/admin-challenge-section';
import { ClientChallengeSection } from './components/client-challenge-section/client-challenge-section';
import { AdminRecompenseSection } from './components/admin-recompense-section/admin-recompense-section';
import { ClientRecompenseSection } from './components/client-recompense-section/client-recompense-section';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { authGuard } from './services/guard/auth-guard';
import { AdminClientSection } from './components/admin-client-section/admin-client-section';

export const routes: Routes = [
    { path: '', redirectTo: 'acceuil', pathMatch: 'full' },
    { path:'acceuil', component:Home},
    { path:'login', component:Login},
    { path:'signup', component:Signup},
    { path:'verification_mail', component:EmailVerification},
    { path:'reset_password', component:ResetPassword},
    {path: 'forget_password',component: ForgotPassword},
    {path: 'main',component: Main,canActivate: [authGuard],
        children: [
            // Profile (admin + client)
            { path: 'profile', component: ProfileSection },
            // ADMIN
            { path: 'admin/dashboard', component: AdminDashboardSection },
            { path: 'admin/actions', component: ActionSection },
            { path: 'admin/clients', component: AdminClientSection },
            { path: 'admin/badges', component: AdminBadgeSection },
            { path: 'admin/challenges', component: AdminChallengeSection },
            { path: 'admin/recompenses', component: AdminRecompenseSection },

            // CLIENT
            { path: 'dashboard', component: ClientDashboardSection },
            { path: 'actions', component: ActionSection },
            { path: 'badges', component: ClientBadgeSection },
            { path: 'challenges', component: ClientChallengeSection },
            { path: 'recompenses', component: ClientRecompenseSection },
        ]
    },
];
 