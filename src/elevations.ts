import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';

export class Elevations extends Page {
  constructor() {
    super(PAGE_IDS.ELEVATIONS);
  }

  isElevationLayer = (layerName: string) =>
    layerName?.startsWith(THEME_PREFIXES.ELEVATIONS);

  parseRgbaNumber = (number: number) => Number((number * 255).toFixed());

  parseEffectColor = (color: RGBA) =>
    `rgba(${this.parseRgbaNumber(color.r)}, ${this.parseRgbaNumber(
      color.g,
    )}, ${this.parseRgbaNumber(color.b)}, ${Math.round(color.a * 100) / 100})`;

  parseEffects = (
    effects: Array<DropShadowEffect | InnerShadowEffect | BlurEffect>,
  ) =>
    effects
      ?.map(
        ({
          offset,
          radius,
          spread,
          type,
          color,
        }: DropShadowEffect | InnerShadowEffect) => {
          const alphaValue = this.parseEffectColor(color);
          let boxShadow = '';
          if (type === 'INNER_SHADOW') {
            boxShadow = 'inset ';
          }
          boxShadow += `${offset.x}px ${offset.y}px ${radius}px ${spread}px ${alphaValue}`;
          return boxShadow;
        },
      )
      .reverse()
      .join(', ');

  get = () => {
    this.traversePage((children: any) => {
      if (this.isElevationLayer(children?.name)) {
        const boxShadow = this.parseEffects(children.effects);
        const elevationToken = children.name.replace(
          THEME_PREFIXES.ELEVATIONS,
          '',
        );
        this.data[elevationToken] = boxShadow;
      }
    });

    return this.data;
  };
}
