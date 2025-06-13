import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"registeration",
        loadComponent: () => import ('../../../projects/registeration/src/app/app.component').then(m => m.AppComponent)
    }
];
