import {Component} from 'angular2/core';

@Component({
  selector: 'filters',
  template: `
    <div class="left">
      <div class="align-center">
        <label><input type="checkbox" name="marksman" checked/>Marksman</label>
        <label><input type="checkbox" name="pusher" checked/>Pusher</label>
        <label><input type="checkbox" name="assasin" checked/>Assasin</label>
        <label><input type="checkbox" name="stealth" checked/>Stealth</label>
      </div>
    </div>
    <div class="center align-center">
      <div>
        <h2>Choose your weapon</h2>
        <input type="text" name="name" placeholder="Name" #championName/>
        <div class="align-center melee-ranged">
          <label><input type="checkbox" name="melee" checked/>Melee</label>
          <label><input type="checkbox" name="ranged" checked/>Ranged</label>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="align-center">
        <label><input type="checkbox" name="mage" checked/>Mage</label>
        <label><input type="checkbox" name="support" checked/>Support</label>
        <label><input type="checkbox" name="tank" checked/>Tank</label>
        <label><input type="checkbox" name="fighter" checked/>Fighter</label>
      </div>
    </div>`
})

export class FiltersComponent {

  constructor() {
  }
}
