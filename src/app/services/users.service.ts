import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor() {}
  getUsers() {
    return [
      {
        id: 1,
        name: 'Jean Dupont',
        role: 'student',
        email: 'jean.dupont@univ-example.fr',
      },
      {
        id: 2,
        name: 'Marie Martin',
        role: 'student',
        email: 'marie.martin@univ-example.fr',
      },
      {
        id: 3,
        name: 'Club Robotique',
        role: 'club',
        email: 'robotique@clubs-univ.fr',
      },
      {
        id: 4,
        name: 'Club Théâtre',
        role: 'club',
        email: 'theatre@clubs-univ.fr',
      },
      {
        id: 5,
        name: 'Laurent Dubois',
        role: 'teacher',
        email: 'laurent.dubois@univ-example.fr',
      },
      {
        id: 6,
        name: 'Sophie Lambert',
        role: 'teacher',
        email: 'sophie.lambert@univ-example.fr',
      },
      {
        id: 7,
        name: 'Thomas Leroy',
        role: 'student',
        email: 'thomas.leroy@univ-example.fr',
      },
      {
        id: 8,
        name: 'Club Musique',
        role: 'club',
        email: 'musique@clubs-univ.fr',
      },
      {
        id: 9,
        name: 'Alain Mercier',
        role: 'teacher',
        email: 'alain.mercier@univ-example.fr',
      },
      {
        id: 10,
        name: 'Émilie Petit',
        role: 'student',
        email: 'emilie.petit@univ-example.fr',
      },
    ];
  }
}
