class Config {
  margin: any = {top: 20, right: 20, bottom: 20, left: 60};
  width: number = 1500;
  height: number = 650;

  abilitiesWidth: number = this.width;
  abilitiesHeight: number = 250 - this.margin.bottom;
  graphWidth: number = this.width - this.margin.left - this.margin.right;
  graphHeight: number = this.height - this.abilitiesHeight - this.margin.top - this.margin.bottom;

  timeInterval = 5 * 60 * 1000;
  levelXp = [0, 280, 660, 1140, 1720, 2400, 3180, 4060, 5040, 6120, 7300, 8580, 9960, 11440, 13020, 14700, 16480, 18360];
}

export let config = new Config();
