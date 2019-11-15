import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  { path: '', component: TabsPage, children: [
      { path: 'tab1', children: [
          { path: '', loadChildren: '../settings/settings.module#SettingsPageModule' } ]
      },
      { path: 'tab2', children: [
          { path: '', loadChildren: '../tab2/tab2.module#Tab2PageModule' } ]
      },
      { path: 'tab3', children: [
          { path: '', loadChildren: '../items/items.module#ItemsPageModule' } ]
      },
      { path: 'tab4', children: [
          { path: '', loadChildren: '../profile/profile.module#ProfilePageModule' } ]
      },
      { path: '', redirectTo: '/tabs/tab3', pathMatch: 'full' } ]
  },
  { path: '', redirectTo: '/tabs/tab3', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
