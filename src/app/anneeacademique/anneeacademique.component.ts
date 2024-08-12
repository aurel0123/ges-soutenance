import { Component, OnInit } from '@angular/core';
import { AnneeAcademiqueService } from '../services/annee-academique.service';

@Component({
  selector: 'app-anneeacademique',
  templateUrl: './anneeacademique.component.html',
  styleUrls: ['./anneeacademique.component.css']
})
export class AnneeacademiqueComponent implements OnInit {

  anneeAcademinique = {
    id: 0,
    code: "",
    libelle: ""
  };

  anneeAcademiquesList: any[] = [];
  filteredAnneeAcademiquesList: any[] = [];
  searchText: string = '';

  constructor(
    private anneeAcademiqueService: AnneeAcademiqueService,
  ) { }

  ngOnInit(): void {
    this.anneeAcademiqueService.getAll().subscribe(
      (data) => {
        this.anneeAcademiquesList = data;
        this.filteredAnneeAcademiquesList = data;
        console.log('data ===', data.length);
      }
    );
  }

  enregistrer(): void {
    if (this.anneeAcademinique.code == "" || this.anneeAcademinique.libelle == "") {
      alert("Champs vides ");
    } else {
      const duplicate = this.anneeAcademiquesList.some(annee => annee.code === this.anneeAcademinique.code || annee.libelle === this.anneeAcademinique.libelle);
      if (duplicate) {
        alert("Code ou Libelle existe déjà");
        return;
      }
      
      if (this.anneeAcademinique.id == 0) {
        this.anneeAcademinique.id = this.getMaxId();
        this.anneeAcademiqueService.create(this.anneeAcademinique).subscribe(
          (data) => {
            this.anneeAcademiquesList.unshift(data);
            this.applyFilter();
            this.resetForm();
          }
        );
      } else {
        const i = this.anneeAcademiquesList.findIndex((element) => element.id == this.anneeAcademinique.id);
        this.anneeAcademiqueService.update(this.anneeAcademinique.id.toString(), this.anneeAcademinique).subscribe(
          (data) => {
            this.anneeAcademiquesList[i] = this.anneeAcademinique;
            this.applyFilter();
            this.resetForm();
          }
        );
      }
    }
  }

  editer(element: any): void {
    this.anneeAcademinique = element;
    console.log(this.anneeAcademinique);
  }

  getMaxId(): number {
    let id = 0;
    this.anneeAcademiquesList.forEach((element) => {
      if (element.id > id) {
        id = element.id;
      }
    });
    return (id + 1);
  }

  deleteElement(element: any): void {
    const i = confirm("VOUS VOULEZ SUPPRIMER " + element.libelle + " ?");
    if (i == true) {
      const index = this.anneeAcademiquesList.findIndex((item) => item.id == element.id);
      this.anneeAcademiquesList.splice(index, 1);
      this.anneeAcademiqueService.delete(element.id).subscribe(() => this.applyFilter());
    }
  }

  annuler(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.anneeAcademinique = {
      id: 0,
      code: "",
      libelle: ""
    };
  }

  applyFilter(): void {
    this.filteredAnneeAcademiquesList = this.anneeAcademiquesList.filter((annee) =>
      Object.values(annee).some(value => 
        value != null && 
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
}
