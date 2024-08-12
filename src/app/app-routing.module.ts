import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiliereComponent } from './filiere/filiere.component';
import { AnneeacademiqueComponent } from './anneeacademique/anneeacademique.component';
import { NiveauetudeComponent } from './niveauetude/niveauetude.component';
import { PresidentComponent } from './president/president.component';
import { ExaminateurComponent } from './examinateur/examinateur.component';
import { LicenceComponent } from './licence/licence.component';
import { MasterComponent } from './master/master.component';
import { ThemelicenceComponent } from './themelicence/themelicence.component';
import { PlanningmasterComponent } from './planningmaster/planningmaster.component';
import { PlanningLicenceComponent } from './planninglicence/planninglicence.component';





const routes: Routes = [
  { path: 'configuration/filiere', component: FiliereComponent},
 {path: 'configuration/anneeacademique', component:AnneeacademiqueComponent},
 {path: 'connexion', component:AnneeacademiqueComponent},
 {path: 'configuration/niveauetude', component:NiveauetudeComponent},
 {path: 'jury/president', component:PresidentComponent},
 {path: 'jury/examinateur', component:ExaminateurComponent},
 {path: 'jury/rapporteur', component:ExaminateurComponent},
 {path: 'etudiant/licence', component:LicenceComponent},
{path: 'etudiant/master', component:MasterComponent},
{path: 'Soutenance/themelicence', component:ThemelicenceComponent},
{path: 'Dashboard/planningmaster', component : PlanningmasterComponent},
{path: 'Dashboard/planninglicence', component : PlanningLicenceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
