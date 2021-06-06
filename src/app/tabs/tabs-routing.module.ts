import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    // Estamos considerando estas rotas como FILHAS, em outras palavras, não são páginas distintas! 
    // Basicamente são 3 páginas "diferentes" que compõem uma só página! Assim como o professor explicou!!!!!!!
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.module').then( m => m.FeedPageModule)
      },
      {
        path: 'uploader',
        loadChildren: () => import('../uploader/uploader.module').then( m => m.UploaderPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'editar-profile',
        loadChildren: () => import('../editar-profile/editar-profile.module').then( m => m.EditarProfilePageModule)
      },
      {
        path: 'friend-profile',
        loadChildren: () => import('../friend-profile/friend-profile.module').then( m => m.FriendProfilePageModule)
      }
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
