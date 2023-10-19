import { PAGE_IDS, LOCAL_VARIABLES_PREFIXES } from './constants';
import { Page } from './page';

export class Colors extends Page {
  private modeId: string;

  constructor(modeId: string) {
    super(PAGE_IDS.COLORS);
    this.modeId = modeId;
  }

  private componentToHex(c: number): string {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  private rgbaToHex = ({ r, g, b, a }: RGBA): string =>
    `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}${this.componentToHex(
      a
    )}`.toUpperCase();

  public get(): Record<string, string> {
    this.getLocalVariables().forEach((variable) => {
      if (variable.name.startsWith(LOCAL_VARIABLES_PREFIXES.COLORS)) {
        const colorToken = variable.name.split('/').pop();

        if (variable.valuesByMode[this.modeId]) {
          const colorValue = variable.valuesByMode[this.modeId];
          const colorValueHex = this.rgbaToHex(colorValue as RGBA);
          this.data[colorToken] = colorValueHex;
        } else {
          console.warn(`No color value found for modeId: ${this.modeId} in variable: ${variable.name}`);
        }
      }
    });

    return this.data;
  }
}
