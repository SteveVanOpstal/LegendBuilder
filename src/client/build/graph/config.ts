class Config {
  constructor() { }

  margin: any = { top: 20, right: 20, bottom: 20, left: 60 };
  width: number = 1500;
  height: number = 650;

  abilitiesWidth: number = this.width;
  abilitiesHeight: number = 250 - this.margin.bottom;
  graphWidth: number = this.width - this.margin.left - this.margin.right;
  graphHeight: number = this.height - this.abilitiesHeight - this.margin.top - this.margin.bottom;
}

export let config = new Config();