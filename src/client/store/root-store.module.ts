import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

// import {environment} from '../../environments/environment';

// const modules: any = [StoreModule.forRoot({})];

// const devModules: any = [
//   StoreDevtoolsModule.instrument()
// ];

// if (!environment.production) {
//   modules.concat(devModules);
// }

@NgModule({imports: [StoreModule.forRoot({}), StoreDevtoolsModule.instrument()]})
export class RootStoreModule {}
