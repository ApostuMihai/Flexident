import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { PacientiComponent } from './pacienti/pacienti.component';
import { TarifeComponent } from './tarife/tarife.component';
import { PersonalComponent } from './personal/personal.component';
import { ProgramariComponent } from './programari/programari.component';
import { AdminComponent } from './admin/admin.component';
import { RoleGuard } from './role.guard';
import { HelpScreenComponent } from './help-screen/help-screen.component';
import { ProfileComponent } from './profile/profile.component';
export const routes: Routes = [
    
    {
        path: "",
        component: LoginComponent,
        title: "Flexident"
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
          { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
          { path: 'pacienti', component: PacientiComponent, canActivate: [authGuard]},
          { path: 'tarife', component: TarifeComponent, canActivate: [authGuard]},
          { path: 'personal', component: PersonalComponent, canActivate: [authGuard]},
          { path: 'programari', component: ProgramariComponent, canActivate:[authGuard]},
          { path: 'admin', component: AdminComponent, canActivate:[authGuard, RoleGuard]},
          { path: 'profil', component: ProfileComponent, canActivate:[authGuard]}
          // Add more child routes here that should show the sidenav
        ]
      },
    {
        path: "login",
        component: LoginComponent,
        title: "Flexident"
    },
    {
        path: "register",
        component: RegisterComponent,
        title: "Flexident"
    },
    {
        path: "helpingpage",
        component: HelpScreenComponent,
        title: "Flexident"
    }

];
