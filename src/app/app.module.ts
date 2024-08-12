import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FiliereComponent } from './filiere/filiere.component';
import { RouterModule } from '@angular/router';
import { AnneeacademiqueComponent } from './anneeacademique/anneeacademique.component';
import { NiveauetudeComponent } from './niveauetude/niveauetude.component';
import { FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PresidentComponent } from './president/president.component';
import { ExaminateurComponent } from './examinateur/examinateur.component';
import { RapporteurComponent } from './rapporteur/rapporteur.component';
import { LicenceComponent } from './licence/licence.component';
import { MasterComponent } from './master/master.component';
import { ThemelicenceComponent } from './themelicence/themelicence.component';
import { PlanningmasterComponent } from './planningmaster/planningmaster.component';
import { PlanningLicenceComponent } from './planninglicence/planninglicence.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import  {MatButtonModule} from '@angular/material/button'
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule
import { EmpAddPlanningComponent } from './emp-add-planning/emp-add-planning.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [
    AppComponent,
    FiliereComponent,
    AnneeacademiqueComponent,
    NiveauetudeComponent,
    PresidentComponent,
    ExaminateurComponent,
    RapporteurComponent,
    LicenceComponent,
    MasterComponent,
    ThemelicenceComponent,
    PlanningmasterComponent,
    PlanningLicenceComponent,
    EmpAddPlanningComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,  // Ajoutez ReactiveFormsModule ici
    HttpClientModule, BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatMenuModule, // Ajouter MatMenuModule ici
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
