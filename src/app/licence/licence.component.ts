import { Component, OnInit } from '@angular/core';
import { LicenceService } from '../services/licence.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';

type AOA = any[][];

@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.css']
})
export class LicenceComponent implements OnInit {

  licence = {
    id: 0,
    matricule: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    filiere: ""
  };

  licencesList: any[] = [];
  filteredLicencesList: any[] = [];
  searchText: string = '';

  constructor(private licenceService: LicenceService) { }

  ngOnInit(): void {
    this.licenceService.getAll().subscribe((data) => {
      this.licencesList = data.map(item => {
        return {
          ...item,
          dateNaissance: this.formatDate(item.dateNaissance)
        };
      });
      this.filteredLicencesList = [...this.licencesList];
    });
  }

  enregistrer(): void {
    if (this.licence.matricule === "" || this.licence.nom === "" || this.licence.prenom === "" || this.licence.dateNaissance === "" || this.licence.lieuNaissance === "" || this.licence.filiere === "") {
      alert("Champs vides");
    } else {
      const duplicate = this.licencesList.find(item =>
        item.matricule === this.licence.matricule &&
        item.nom === this.licence.nom &&
        item.prenom === this.licence.prenom &&
        item.dateNaissance === this.licence.dateNaissance &&
        item.lieuNaissance === this.licence.lieuNaissance &&
        item.filiere === this.licence.filiere
      );
      if (duplicate) {
        alert("Une licence avec les mêmes informations existe déjà.");
      } else {
        if (this.licence.id === 0) {
          this.licence.id = this.getMaxId();
          this.licenceService.create(this.licence).subscribe(
            (data) => {
              data.dateNaissance = this.formatDate(data.dateNaissance);
              this.licencesList.unshift(data);
              this.filteredLicencesList = [...this.licencesList];
              this.resetForm();
            });
        } else {
          const i = this.licencesList.findIndex((element) => element.id === this.licence.id);
          this.licenceService.update(this.licence.id.toString(), this.licence).subscribe(
            (data) => {
              this.licencesList[i] = { ...this.licence, dateNaissance: this.formatDate(this.licence.dateNaissance) };
              this.filteredLicencesList = [...this.licencesList];
              this.resetForm();
            });
        }
      }
    }
  }

  editer(element: any): void {
    this.licence = { ...element, dateNaissance: this.formatDate(element.dateNaissance) };
  }

  getMaxId(): number {
    let id = 0;
    this.licencesList.forEach((element) => {
      if (element.id > id) {
        id = element.id;
      }
    });
    return (id + 1);
  }

  deleteElement(element: any): void {
    const confirmDelete = confirm("Voulez-vous supprimer " + element.nom + " " + element.prenom + " ?");
    if (confirmDelete) {
      const index = this.licencesList.findIndex((el) => el.id === element.id);
      this.licencesList.splice(index, 1);
      this.filteredLicencesList = [...this.licencesList];
      this.licenceService.delete(element.id).subscribe();
    }
  }

  annuler(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.licence = {
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
    
      // Vider les listes existantes
      this.licencesList = [];
      this.filteredLicencesList = [];
  
      // Ajouter chaque élément de data à la base de données JSON via le service
      filteredData.forEach((item: any) => {
        const dateNaissance = this.parseExcelDate(item[3]);
    
        const licenceData = {
          matricule: item[0], // Modifier en fonction de la structure de votre fichier Excel
          nom: item[1],
          prenom: item[2],
          dateNaissance: dateNaissance,
          lieuNaissance: item[4],
          filiere: item[5]
        };
    
        // Appel du service pour créer une nouvelle licence
        this.licenceService.create(licenceData).subscribe(
          (data) => {
            this.licencesList.unshift(data); // Ajouter à la liste des licences après création
            this.filteredLicencesList = [...this.licencesList];
          },
          (error) => {
            console.error('Erreur lors de la création de la licence : ', error);
          }
        );
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }
  

  applyFilter(): void {
    this.filteredLicencesList = this.licencesList.filter((licence) =>
      Object.values(licence).some(value => 
        value != null && 
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

  trierParDateNaissance(): void {
    this.filteredLicencesList.sort((a, b) => new Date(a.dateNaissance).getTime() - new Date(b.dateNaissance).getTime());
  }

  trierParLieuNaissance(): void {
    this.filteredLicencesList.sort((a, b) => a.lieuNaissance.localeCompare(b.lieuNaissance));
  }

  trierParFiliere(): void {
    this.filteredLicencesList.sort((a, b) => a.filiere.localeCompare(b.filiere));
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      // If the date is not valid, return the original input
      return date;
    }
    return formatDate(parsedDate, 'yyyy-MM-dd', 'en-US');
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


}

 

