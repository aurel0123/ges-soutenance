import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PlanningLicenceService, Student } from '../services/planning-licence-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-emp-add-planning',
  templateUrl: './emp-add-planning.component.html',
  styleUrls: ['./emp-add-planning.component.css'],
})
export class EmpAddPlanningComponent implements OnInit {
  formGroup: FormGroup;
  grade: string[] = ['Maitre', 'Ingenieur', 'Graduate', 'Post Graduate'];
  planningLicence: any = {
    id: 0,
    jury: '',
    salle: '',
    date: '',
    heure: '',
    theme: '',
    directeur: '',
    president: '',
    examinateur: '',
    rapporteur: '',
    etudiant1: '',
    etudiant2: '',
  };

  planningLicencesList: any[] = [];
  themesList: any[] = [];
  presidentsList: any[] = [];
  options: Student[] = [];
  filteredOptions1!: Observable<Student[]>;
  filteredOptions2!: Observable<Student[]>;

  etudiantControl1 = new FormControl<string | Student>('');
  etudiantControl2 = new FormControl<string | Student>('');

  constructor(
    private fb: FormBuilder,
    private planningLicenceService: PlanningLicenceService,
    private _dialogRef: MatDialogRef<EmpAddPlanningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formGroup = this.fb.group({
      jury: ['', Validators.required],
      salle: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      theme: ['', Validators.required],
      directeur: ['', Validators.required],
      president: ['', Validators.required],
      examinateur: ['', Validators.required],
      rapporteur: ['', Validators.required],
      etudiant1: this.etudiantControl1,
      etudiant2: this.etudiantControl2,
      grade: ['', Validators.required]
    });

    if (data && data.planning) {
      this.planningLicence = data.planning;
      this.formGroup.patchValue(this.planningLicence);
      this.etudiantControl1.setValue(this.planningLicence.etudiant1);
      this.etudiantControl2.setValue(this.planningLicence.etudiant2);
    }
  }

  ngOnInit(): void {
    this.planningLicenceService.getAll().subscribe((data) => {
      this.planningLicencesList = data;
    });

    this.planningLicenceService.getThemes().subscribe((data) => {
      this.themesList = data;
    });

    this.planningLicenceService.getPresidents().subscribe((data) => {
      this.presidentsList = data;
    });

    this.planningLicenceService.getStudents().subscribe((students) => {
      this.options = students;
    });

    this.filteredOptions1 = this.etudiantControl1.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.nom;
        return name ? this._filter(name as string, this.options) : this.options.slice();
      })
    );

    this.filteredOptions2 = this.etudiantControl2.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.nom;
        return name ? this._filter(name as string, this.options) : this.options.slice();
      })
    );
  }

  displayFn(student: Student): string {
    return student && student.nom ? `${student.nom} ${student.prenom}` : '';
  }

  private _filter(name: string, options: Student[]): Student[] {
    const filterValue = name.toLowerCase();
    return options.filter((option) =>
      `${option.nom} ${option.prenom}`.toLowerCase().includes(filterValue)
    );
  }

  enregistrer(): void {
    if (this.formGroup.invalid) {
      alert('Champs vides');
      return;
    }

    const selectedTheme = this.themesList.find(theme => theme.id === this.formGroup.value.theme);
    const selectedPresident = this.presidentsList.find(president => president.id === this.formGroup.value.president);
    const selectedExaminateur = this.presidentsList.find(examinateur => examinateur.id === this.formGroup.value.examinateur);
    const selectedRapporteur = this.presidentsList.find(rapporteur => rapporteur.id === this.formGroup.value.rapporteur);

    const planningData = {
      ...this.planningLicence,
      ...this.formGroup.value,
      theme: selectedTheme ? selectedTheme.theme : '',
      president: selectedPresident ? `${selectedPresident.nom} ${selectedPresident.prenom}` : '',
      examinateur: selectedExaminateur ? `${selectedExaminateur.nom} ${selectedExaminateur.prenom}` : '',
      rapporteur: selectedRapporteur ? `${selectedRapporteur.nom} ${selectedRapporteur.prenom}` : ''
    };

    const duplicate = this.planningLicencesList.some(
      (planning) =>
        planning.theme === planningData.theme &&
        (planning.etudiant1 === planningData.etudiant1 || planning.etudiant2 === planningData.etudiant2)
    );
    if (duplicate) {
      alert('Une entrée avec ce thème et ces étudiants existe déjà');
      return;
    }

    if (this.planningLicence.id === 0) {
      planningData.id = this.getMaxId();
      this.planningLicenceService.create(planningData).subscribe((data) => {
        this.planningLicencesList.unshift(data);
        this.resetForm();
        this._dialogRef.close(true);
      });
    } else {
      this.planningLicenceService.update(this.planningLicence.id, planningData).subscribe(
        (val: any) => {
          const i = this.planningLicencesList.findIndex(element => element.id == this.planningLicence.id);
          this.planningLicencesList[i] = val;
          this.resetForm();
          this._dialogRef.close(true);
        },
        (err: any) => {
          console.error(err);
        }
      );
    }
  }

  getMaxId(): number {
    let id = 0;
    this.planningLicencesList.forEach((element) => {
      if (element.id > id) {
        id = element.id;
      }
    });
    return id + 1;
  }

  annuler(): void {
    this.resetForm();
    this._dialogRef.close(false);
  }

  resetForm(): void {
    this.planningLicence = {
      id: 0,
      jury: '',
      salle: '',
      date: '',
      heure: '',
      theme: '',
      directeur: '',
      president: '',
      examinateur: '',
      rapporteur: '',
      etudiant1: '',
      etudiant2: '',
    };
    this.formGroup.reset();
    this.etudiantControl1.setValue('');
    this.etudiantControl2.setValue('');
  }
}
