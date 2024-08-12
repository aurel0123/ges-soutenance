import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddPlanningComponent } from '../emp-add-planning/emp-add-planning.component';
import { PlanningLicenceService } from '../services/planning-licence-service.service';

@Component({
  selector: 'app-planninglicence',
  templateUrl: './planninglicence.component.html',
  styleUrls: ['./planninglicence.component.css']
})
export class PlanningLicenceComponent implements OnInit {
  planningLicencesList: any[] = [];
  displayedColumns: string[] = ['jury', 'salle', 'date', 'heure', 'theme', 'directeur', 'grade', 'president', 'examinateur', 'rapporteur', 'actions'];
  filteredPlanningLicencesList: any[] = [];
  constructor(
    private _dialog: MatDialog,
    private planningLicenceService: PlanningLicenceService
  ) {}

  ngOnInit(): void {
    this.getPlanningLicences();
  }

  openAddPlanningForm() {
    this._dialog.open(EmpAddPlanningComponent, {
      width: '600px',
      data: {}
    }).afterClosed().subscribe(result => {
      if (result) {
        this.getPlanningLicences();
      }
    });
  }

  openEditPlanningForm(planning: any) {
    this._dialog.open(EmpAddPlanningComponent, {
      width: '600px',
      data: { planning }
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.getPlanningLicences();
      }
    });
  }
  deletePlanning(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce planning ?')) {
      this.planningLicenceService.delete(id).subscribe(() => {
        this.getPlanningLicences();
      });
    }
  }

  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input.value.trim().toLowerCase();
    this.filteredPlanningLicencesList = this.planningLicencesList.filter(planning => {
      return Object.keys(planning).some(key => {
        return String(planning[key]).toLowerCase().includes(filterValue);
      });
    });
  }

  getPlanningLicences() {
    this.planningLicenceService.getAll().subscribe((data) => {
      this.planningLicencesList = data;
      this.filteredPlanningLicencesList = data; // Initialiser avec les données non filtrées
    });
  }
}
