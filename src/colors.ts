import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';

export class Colors extends Page {
  constructor() {
    super(PAGE_IDS.COLORS);
  }
  componentToHex = (c: number) => {
    const transformNumber = Number((c * 255).toFixed());
    const hex = transformNumber.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };

  rgbToHex = (r: number, g: number, b: number) =>
    `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(
      b,
    )}`.toUpperCase();

  get = () => {
    this.traversePage((children: any) => {
      if (this.nodeStartsWithPrefix(children?.name, THEME_PREFIXES.COLORS)) {
        const colorToken = children.name.replace(THEME_PREFIXES.COLORS, '');
        const colorRgb = children.fills?.[0]?.color;
        const colorHex = this.rgbToHex(colorRgb.r, colorRgb.g, colorRgb.b);
        this.data[colorToken] = colorHex;
      }
    });

    return this.data;
  };
}
