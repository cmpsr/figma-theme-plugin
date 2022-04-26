import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Radius extends Page {
  constructor() {
    super(PAGE_IDS.RADIUS);
  }
  isRadiusLayer = (layerName: string) =>
    layerName?.startsWith(THEME_PREFIXES.RADIUS);

  get = () => {
    this.traversePage((children: any) => {
      if (this.isRadiusLayer(children?.name)) {
        const radiusToken = children.name.replace(THEME_PREFIXES.RADIUS, '');
        this.data[radiusToken] = convertPxToRem(children.cornerRadius);
      }
    });

    return this.data;
  };
}
