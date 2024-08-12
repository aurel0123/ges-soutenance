import { Component, OnInit } from '@angular/core';
import { PresidentService } from '../services/president.service';

@Component({
  selector: 'app-president',
  templateUrl: './president.component.html',
  styleUrls: ['./president.component.css']
})
export class PresidentComponent implements OnInit {

  president = {
    id: 0,
    nom: "",
    prenom: "",
    telephone: "",
    email: ""
  };

  presidentsList: any[] = [];
  filteredPresidentsList: any[] = [];
  searchText: string = '';

  constructor(private presidentService: PresidentService) { }

  ngOnInit(): void {
    this.presidentService.getAll().subscribe(
      (data) => {
        this.presidentsList = data;
        this.filteredPresidentsList = data;
        console.log('data ===', data.length);
      });
  }

  enregistrer(): void {
    if (this.president.nom === "" || this.president.prenom === "" || this.president.telephone === "" || this.president.email === "") {
      alert("Champs vides");
    } else {
      const duplicate = this.presidentsList.find(item =>
        item.nom === this.president.nom &&
        item.prenom === this.president.prenom &&
        item.telephone === this.president.telephone &&
        item.email === this.president.email
      );
      if (duplicate) {
        alert("Un membre avec les mêmes informations existe déjà.");
      } else {
        if (this.president.id === 0) {
          this.president.id = this.getMaxId();
          this.presidentService.create(this.president).subscribe(
            (data) => {
              this.presidentsList.unshift(data);
              this.applyFilter();
              this.resetForm();
            });
        } else {
          const i = this.presidentsList.findIndex((element) => element.id === this.president.id);
          this.presidentService.update(this.president.id.toString(), this.president).subscribe(
            (data) => {
              this.presidentsList[i] = this.president;
              this.applyFilter();
              this.resetForm();
            });
        }
      }
    }
  }

  editer(element: any): void {
    this.president = { ...element };
    console.log(this.president);
  }

  getMaxId(): number {
    let id = 0;
    this.presidentsList.forEach((element) => {
      if (element.id > id) {
        id = element.id;
      }
    });
    return (id + 1);
  }

  deleteElement(element: any): void {
    const i = confirm("Voulez-vous supprimer " + element.nom + " ?");
    if (i === true) {
      const j = this.presidentsList.findIndex((el) => el.id === element.id);
      this.presidentsList.splice(j, 1);
      this.presidentService.delete(element.id).subscribe(() => this.applyFilter());
    }
  }

  annuler(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.president = {
      id: 0,
      nom: "",
      prenom: "",
      telephone: "",
      email: ""
    };
  }

  applyFilter(): void {
    this.filteredPresidentsList = this.presidentsList.filter((president) =>
      Object.values(president).some(value =>
        value != null &&
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
}
