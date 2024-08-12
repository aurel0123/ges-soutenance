import { Component, OnInit } from '@angular/core';
import { filieresService } from '../services/filiere.service';

@Component({
  selector: 'app-filiere',
  templateUrl: './filiere.component.html',
  styleUrls: ['./filiere.component.css']
})
export class FiliereComponent implements OnInit {

  Filieres = {
    id: 0,
    code: "",
    libelle: ""
  };

  FilieresList: any[] = [];
  filteredFilieresList: any[] = [];
  searchText: string = '';

  constructor(
    private filieresService: filieresService,
  ) { }

  ngOnInit(): void {
    this.filieresService.getAll().subscribe(
      (data) => {
        this.FilieresList = data;
        this.filteredFilieresList = data;
        console.log('data ===', data.length);
      }
    );
  }

  enregistrer(): void {
    if (this.Filieres.code == "" || this.Filieres.libelle == "") {
      alert("Champs vides ");
    } else {
      const duplicate = this.FilieresList.some(filiere => filiere.code === this.Filieres.code || filiere.libelle === this.Filieres.libelle);
      if (duplicate) {
        alert("Code ou Libelle existe déjà");
        return;
      }
      
      if (this.Filieres.id == 0) {
        this.Filieres.id = this.getMaxId();
        this.filieresService.create(this.Filieres).subscribe(
          (data) => {
            this.FilieresList.unshift(data);
            this.applyFilter();
            this.resetForm();
          }
        );
      } else {
        const i = this.FilieresList.findIndex((element) => element.id == this.Filieres.id);
        this.filieresService.update(this.Filieres.id.toString(), this.Filieres).subscribe(
          (data) => {
            this.FilieresList[i] = this.Filieres;
            this.applyFilter();
            this.resetForm();
          }
        );
      }
    }
  }

  editer(element: any): void {
    this.Filieres = element;
    console.log(this.Filieres);
  }

  getMaxId(): number {
    let id = 0;
    this.FilieresList.forEach((element) => {
      if (element.id > id) {
        id = element.id;
      }
    });
    return (id + 1);
  }

  deleteElement(element: any): void {
    const i = confirm("VOUSLEZ-VOUS SUPPRIMER " + element.libelle + " ?");
    if (i == true) {
      const index = this.FilieresList.findIndex((item) => item.id == element.id);
      this.FilieresList.splice(index, 1);
      this.filieresService.delete(element.id).subscribe(() => this.applyFilter());
    }
  }

  annuler(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.Filieres = {
      id: 0,
      code: "",
      libelle: ""
    };
  }

  applyFilter(): void {
    this.filteredFilieresList = this.FilieresList.filter((filiere) =>
      Object.values(filiere).some(value => 
        value != null && 
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
}
