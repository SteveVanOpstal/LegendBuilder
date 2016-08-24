import {inject, TestBed} from '@angular/core/testing';

import {PreviewComponent} from './preview.component';

describe('PreviewComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [PreviewComponent]});
  });

  let item1 = {id: 1, from: ['2', '3']};
  let item2 = {id: 2, from: ['4'], into: ['1']};
  let item3 = {id: 3, from: ['4', '5'], into: ['1']};
  let item4 = {id: 4, into: ['2', '3']};
  let item5 = {id: 5, into: ['3']};

  let items = [item1, item2, item3, item4, item5];

  beforeEach(inject([PreviewComponent], (component) => {
    component.items = items;
  }));

  it('should be initialised', inject([PreviewComponent], (component) => {
       expect(component.item).not.toBeDefined();
       expect(component.items).toHaveEqualContent(items);
       expect(component.itemPicked).toBeDefined();
       expect(component.itemsFrom).not.toBeDefined();
       expect(component.itemsInto).not.toBeDefined();
     }));

  it('should update on changes', inject([PreviewComponent], (component) => {
       spyOn(component, 'getItemsFrom');
       spyOn(component, 'getItemsInto');
       expect(component.getItemsFrom).not.toHaveBeenCalled();
       expect(component.getItemsInto).not.toHaveBeenCalled();
       component.item = item2;
       component.ngOnChanges();
       expect(component.getItemsFrom).toHaveBeenCalled();
       expect(component.getItemsInto).toHaveBeenCalled();
     }));

  it('should update on select', inject([PreviewComponent], (component) => {
       spyOn(component, 'ngOnChanges');
       expect(component.ngOnChanges).not.toHaveBeenCalled();
       component.selectItem(item4);
       expect(component.item).toBe(item4);
       expect(component.ngOnChanges).toHaveBeenCalled();
     }));

  it('should not update when there is no item', inject([PreviewComponent], (component) => {
       component.itemsFrom = 'test';
       component.itemsInto = 'test';
       component.ngOnChanges();
       expect(component.itemsFrom).toHaveEqualContent('test');
       expect(component.itemsInto).toHaveEqualContent('test');
     }));

  it('should get from-items', inject([PreviewComponent], (component) => {
       let result = component.getItemsFrom(item1);
       expect(result).toHaveEqualContent([
         {item: item2, children: [{item: item4, children: undefined}]}, {
           item: item3,
           children: [{item: item4, children: undefined}, {item: item5, children: undefined}]
         }
       ]);
     }));

  it('should get into-items', inject([PreviewComponent], (component) => {
       let result = component.getItemsInto(item4);
       expect(result).toHaveEqualContent([item2, item3]);
     }));

  it('should emit itemPicked event when an item is picked',
     inject([PreviewComponent], (component) => {
       spyOn(component.itemPicked, 'emit');
       expect(component.itemPicked.emit).not.toHaveBeenCalled();
       let result = component.pickItem(item4);
       expect(result).toBeFalsy();
       expect(component.itemPicked.emit).toHaveBeenCalled();
     }));

  it('should not get items when there are no items', inject([PreviewComponent], (component) => {
       component.items = undefined;
       let result = component.getItems([1]);
       expect(result).not.toBeDefined();
     }));
});
