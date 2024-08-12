import { Component, OnInit } from '@angular/core';
import { ThemeLicenceService } from '../services/themelicence.service';  // Chemin corrigé

@Component({
  selector: 'app-themelicence',
  templateUrl: './themelicence.component.html',
  styleUrls: ['./themelicence.component.css']
})
export class ThemelicenceComponent implements OnInit {
  themeLicence: any = {
    theme: '',
    filiere: { code: '', libelle: '' },
    etudiants: [{ name: '' }]
  };
  themeLicencesList: any[] = [];
  filteredThemeLicencesList: any[] = [];
  filieresList: any[] = [];
  searchText: string = '';
  numberOfEtudiants: number = 1;
  etudiantsList: any[] = [
    { name: 'Étudiant 1' },
    { name: 'Étudiant 2' },
    { name: 'Étudiant 3' },
    { name: 'Étudiant 4' },
    { name: 'Étudiant 5' },
  ];
  filteredEtudiantsList: any[][] = [[]];

  constructor(private themeLicenceService: ThemeLicenceService) {}

  ngOnInit() {
    this.getThemeLicences();
    this.getFilieres();
  }

  getThemeLicences() {
    this.themeLicenceService.getThemeLicences().subscribe((data: any[]) => {
      this.themeLicencesList = data;
      this.filteredThemeLicencesList = [...this.themeLicencesList];
    });
  }

  getFilieres() {
    this.themeLicenceService.getFilieres().subscribe((data: any[]) => {
      this.filieresList = data;
    });
  }

  enregistrer() {
    const themeLicenceToSave = {
      ...this.themeLicence,
      filiere: this.themeLicence.filiere.code
    };
    

    console.log('Enregistrement du thème de licence :', themeLicenceToSave);

    if (this.themeLicence.id) {
      this.themeLicenceService.updateThemeLicence(themeLicenceToSave).subscribe(
        () => {
          this.getThemeLicences();
        },
        (error) => {
          console.error('Error updating theme licence:', error);
        }
      );
      
    } else {
      this.themeLicenceService.addThemeLicence(themeLicenceToSave).subscribe(
        () => {
          this.getThemeLicences();
        },
        (error) => {
          console.error('Error adding theme licence:', error);
        }
      );
    }
    this.annuler();
  }

  annuler() {
    this.themeLicence = { theme: '', filiere: { code: '', libelle: '' }, etudiants: [{ name: '' }] };
    this.numberOfEtudiants = 1;
    this.filteredEtudiantsList = [[]];
  }

  editer(item: any): void {
    this.themeLicence = {
      ...item,
      filiere: this.filieresList.find(f => f.code === item.filiere) || { code: '', libelle: '' },
      etudiants: item.etudiants || []
    };
    this.numberOfEtudiants = this.themeLicence.etudiants.length;
    this.filteredEtudiantsList = Array(this.numberOfEtudiants).fill([]).map(() => []);
  }

  deleteElement(item: any): void {
    const confirmDelete = confirm(`Voulez-vous supprimer le thème ${item.theme} ?`);
    if (confirmDelete) {
      this.themeLicenceService.deleteThemeLicence(item.id).subscribe(() => {
        this.getThemeLicences();
      });
    }
  }

  filterThemes(): void {
    const search = this.searchText.toLowerCase();
    this.filteredThemeLicencesList = this.themeLicencesList.filter(item =>
      item.theme.toLowerCase().includes(search) ||
      this.getFiliereLabel(item.filiere).toLowerCase().includes(search) ||
      item.etudiants.some((etudiant: any) => etudiant.name.toLowerCase().includes(search))
    );
  }

  filterEtudiants(index: number): void {
    const search = this.themeLicence.etudiants[index].name.toLowerCase();
    this.filteredEtudiantsList[index] = this.etudiantsList.filter(etudiant =>
      etudiant.name.toLowerCase().includes(search)
    );
  }

  selectEtudiant(index: number, etudiant: any): void {
    this.themeLicence.etudiants[index].name = etudiant.name;
    this.filteredEtudiantsList[index] = [];
  }

  updateEtudiantsInputs(): void {
    const currentLength = this.themeLicence.etudiants.length;
    if (this.numberOfEtudiants > currentLength) {
      for (let i = currentLength; i < this.numberOfEtudiants; i++) {
        this.themeLicence.etudiants.push({ name: '' });
        this.filteredEtudiantsList.push([]);
      }
    } else if (this.numberOfEtudiants < currentLength) {
      this.themeLicence.etudiants.splice(this.numberOfEtudiants);
      this.filteredEtudiantsList.splice(this.numberOfEtudiants);
    }
  }

  getFiliereLabel(code: string): string {
    const filiere = this.filieresList.find(f => f.code === code);
    return filiere ? filiere.libelle : 'Non défini';
  }
}
