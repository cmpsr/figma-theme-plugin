import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Radius extends Page {
  constructor() {
    super(PAGE_IDS.RADIUS);
  }

  get = () => {
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.RADIUS)) {
        const radiusNode = node as RectangleNode;
        const radiusToken = node.name.replace(THEME_PREFIXES.RADIUS, '');
        if (radiusNode.cornerRadius !== figma.mixed) {
          this.data[radiusToken] = convertPxToRem(radiusNode.cornerRadius);
        }
      }
    });

    return this.data;
  };
}
