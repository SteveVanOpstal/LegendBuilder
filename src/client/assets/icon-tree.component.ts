import {Component} from '@angular/core';

@Component({
  selector: 'lb-icon-tree',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tree" width="32" height="32"
         viewBox="0 0 32 32" fill="none" stroke="#000" stroke-width="3">
      <rect x="2" y="4" width="8" height="8"></rect>
      <rect x="2" y="20" width="8" height="8"></rect>
      <rect x="22" y="12" width="8" height="8"></rect>
      <path d="M10,8Q16,8 16,11.5T22,15"></path>
      <path d="M10,24Q16,24 16,20.5T22,17"></path>
    </svg>`
})

export class IconTreeComponent {}
