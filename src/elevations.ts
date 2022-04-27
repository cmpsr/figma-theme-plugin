import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';

export class Elevations extends Page {
  constructor() {
    super(PAGE_IDS.ELEVATIONS);
  }

  parseRgbaNumber = (number: number) => Number((number * 255).toFixed());

  parseEffectColor = (color: RGBA) =>
    `rgba(${this.parseRgbaNumber(color.r)}, ${this.parseRgbaNumber(
      color.g,
    )}, ${this.parseRgbaNumber(color.b)}, ${Math.round(color.a * 100) / 100})`;

  parseEffects = (effects: Array<Effect>) =>
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
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.ELEVATIONS)) {
        const elevationNode = node as RectangleNode;
        const elevationStyle = figma.getStyleById(
          elevationNode.effectStyleId,
        ) as BaseStyle & EffectStyle;
        const boxShadow = this.parseEffects(elevationStyle.effects as Effect[]);
        const elevationToken = elevationNode.name.replace(
          THEME_PREFIXES.ELEVATIONS,
          '',
        );
        this.data[elevationToken] = boxShadow;
      }
    });

    return this.data;
  };
}
