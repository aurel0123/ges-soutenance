import { Component, OnInit } from '@angular/core';
import { NiveauEtudeService } from '../services/niveau-etude.service';

@Component({
  selector: 'app-niveauetude',
  templateUrl: './niveauetude.component.html',
  styleUrls: ['./niveauetude.component.css']
})
export class NiveauetudeComponent implements OnInit {

  niveauEtudes = {
    id: 0,
    code: "",
    libelle: ""
  };

  niveauEtudesList: any[] = [];
  filteredNiveauEtudesList: any[] = [];
  searchText: string = '';

  constructor(private NiveauEtudeService: NiveauEtudeService) { }

  ngOnInit(): void {
    this.NiveauEtudeService.getAll().subscribe(
      (data) => {
        this.niveauEtudesList = data;
        this.filteredNiveauEtudesList = data;
        console.log('data ===', data.length);
      }
    );
  }

  enregistrer(): void {
    if (this.niveauEtudes.code === "" || this.niveauEtudes.libelle === "") {
      alert("Champs vides");
    } else {
      const duplicate = this.niveauEtudesList.find(item =>
        item.code === this.niveauEtudes.code &&
        item.libelle === this.niveauEtudes.libelle
      );
      if (duplicate) {
        alert("Un niveau d'étude avec les mêmes informations existe déjà.");
      } else {
        if (this.niveauEtudes.id === 0) {
          this.niveauEtudes.id = this.getMaxId();
          this.NiveauEtudeService.create(this.niveauEtudes).subscribe(
            (data) => {
              this.niveauEtudesList.unshift(data);
              this.applyFilter();
              this.resetForm();
            }
          );
        } else {
          const i = this.niveauEtudesList.findIndex((element) => element.id === this.niveauEtudes.id);
          this.NiveauEtudeService.update(this.niveauEtudes.id.toString(), this.niveauEtudes).subscribe(
            (data) => {
              this.niveauEtudesList[i] = this.niveauEtudes;
              this.applyFilter();
              this.resetForm();
            }
          );
        }
      }
    }
  }

  editer(element: any): void {
    this.niveauEtudes = { ...element };
    console.log(this.niveauEtudes);
  }

  getMaxId(): number {
    let id = 0;
    this.niveauEtudesList.forEach((element) => {
      if (element.id > id) {
        id = element.id;
      }
    });
    return (id + 1);
  }

  deleteElement(element: any): void {
    const i = confirm("Voulez-vous supprimer " + element.libelle + " ?");
    if (i === true) {
      const j = this.niveauEtudesList.findIndex((el) => el.id === element.id);
      this.niveauEtudesList.splice(j, 1);
      this.NiveauEtudeService.delete(element.id).subscribe(() => this.applyFilter());
    }
  }

  annuler(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.niveauEtudes = {
      id: 0,
      code: "",
      libelle: ""
    };
  }

  applyFilter(): void {
    this.filteredNiveauEtudesList = this.niveauEtudesList.filter((niveau) =>
      Object.values(niveau).some(value =>
        value != null &&
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
}
