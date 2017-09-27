import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {itemsReducer} from './items.reducer';

@NgModule({imports: [StoreModule.forFeature('items', itemsReducer, {initialState: []})]})
export class ItemsStoreModule {}
