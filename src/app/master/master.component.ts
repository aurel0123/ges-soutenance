import { Component, OnInit } from '@angular/core';
import { MasterService } from '../services/master.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

type AOA = any[][];

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

  master = {
    id: 0,
    matricule: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    filiere: ""
  };

  mastersList: any[] = [];
  filteredMasterList: any[] = [];
  searchText: string = '';

  constructor(private MasterService: MasterService) { }

  ngOnInit(): void {
    this.MasterService.getAll().subscribe(
      (data) => {
        this.mastersList = data;
        this.filteredMasterList = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des masters :', error);
      }
    );
  }

  enregistrer(): void {
    if (this.master.matricule === "" || this.master.nom === "" || this.master.prenom === "" || this.master.dateNaissance === "" || this.master.lieuNaissance === "" || this.master.filiere === "") {
      alert("Champs vides");
    } else {
      const duplicate = this.mastersList.find(item =>
        item.matricule === this.master.matricule &&
        item.nom === this.master.nom &&
        item.prenom === this.master.prenom &&
        item.dateNaissance === this.master.dateNaissance &&
        item.lieuNaissance === this.master.lieuNaissance &&
        item.filiere === this.master.filiere
      );
      if (duplicate) {
        alert("Un master avec les mêmes informations existe déjà.");
      } else {
        if (this.master.id === 0) {
          this.master.id = this.getMaxId();
          this.MasterService.create(this.master).subscribe(
            (data) => {
              this.mastersList.unshift(data);
              this.applyFilter();
              this.resetForm();
            },
            (error) => {
              console.error('Erreur lors de la création du master :', error);
            }
          );
        } else {
          const i = this.mastersList.findIndex((element) => element.id === this.master.id);
          this.MasterService.update(this.master.id.toString(), this.master).subscribe(
            (data) => {
              this.mastersList[i] = this.master;
              this.applyFilter();
              this.resetForm();
            },
            (error) => {
              console.error('Erreur lors de la mise à jour du master :', error);
            }
          );
        }
      }
    }
  }

  editer(element: any): void {
    this.master = { ...element };
    console.log(this.master);
  }

  getMaxId(): number {
    let id = 0;
    this.mastersList.forEach((element) => {
      if (element.id > id) {
        id = element.id;
      }
    });
    return (id + 1);
  }

  deleteElement(element: any): void {
    const i = confirm("Voulez-vous supprimer " + element.nom + " " + element.prenom + " ?");
    if (i === true) {
      const j = this.mastersList.findIndex((el) => el.id === element.id);
      this.mastersList.splice(j, 1);
      this.MasterService.delete(element.id).subscribe(
        () => {
          this.applyFilter();
        },
        (error) => {
          console.error('Erreur lors de la suppression du master :', error);
        }
      );
    }
  }

  annuler(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.master = {
      id: 0,
      matricule: "",
      nom: "",
      prenom: "",
      dateNaissance: "",
      lieuNaissance: "",
      filiere: ""
    };
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Convertir la feuille de calcul en tableau JSON
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Supprimer la première ligne (en-têtes)
      if (data.length > 0) {
        data.shift(); // Supprime le premier élément du tableau (première ligne)
      }

      // Filtrer les lignes avec des cellules vides
      const filteredData = data.filter((row) => row.some((cell) => cell !== null && cell !== ''));

      // Ajouter chaque élément de data à la base de données JSON via le service
      filteredData.forEach((item: any) => {
        const dateNaissance = this.parseExcelDate(item[3]);

        const masterData = {
          matricule: item[0], // Modifier en fonction de la structure de votre fichier Excel
          nom: item[1],
          prenom: item[2],
          dateNaissance: dateNaissance,
          lieuNaissance: item[4],
          filiere: item[5]
        };

        // Vérifier les doublons
        const duplicate = this.mastersList.find(m =>
          m.matricule === masterData.matricule &&
          m.nom === masterData.nom &&
          m.prenom === masterData.prenom &&
          m.dateNaissance === masterData.dateNaissance &&
          m.lieuNaissance === masterData.lieuNaissance &&
          m.filiere === masterData.filiere
        );

        if (!duplicate) {
          this.MasterService.create(masterData).subscribe(
            (data) => {
              this.mastersList.unshift(data); // Ajouter à la liste des masters après création
              this.applyFilter();
            },
            (error) => {
              console.error('Erreur lors de la création du master :', error);
            }
          );
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  private parseExcelDate(excelDate: any): string {
    if (typeof excelDate === 'number') {
      const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
      return formatDate(date, 'yyyy-MM-dd', 'en-US');
    } else if (typeof excelDate === 'string') {
      return excelDate;
    }
    return '';
  }

  // Méthode de tri pour la date de naissance
  trierParDateNaissance(): void {
    this.mastersList.sort((a, b) => {
      return new Date(a.dateNaissance).getTime() - new Date(b.dateNaissance).getTime();
    });
    this.applyFilter();
  }

  // Méthode de tri pour le lieu de naissance
  trierParLieuNaissance(): void {
    this.mastersList.sort((a, b) => {
      if (a.lieuNaissance < b.lieuNaissance) return -1;
      if (a.lieuNaissance > b.lieuNaissance) return 1;
      return 0;
    });
    this.applyFilter();
  }

  // Méthode de tri pour la filière
  trierParFiliere(): void {
    this.mastersList.sort((a, b) => {
      if (a.filiere < b.filiere) return -1;
      if (a.filiere > b.filiere) return 1;
      return 0;
    });
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredMasterList = this.mastersList.filter((master) =>
      Object.values(master).some(value => 
        value != null && 
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
}
