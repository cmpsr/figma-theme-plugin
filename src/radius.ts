import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Radius extends Page {
  constructor() {
    super(PAGE_IDS.RADIUS);
  }

  get = () => {
    this.traversePage((children: any) => {
      if (this.nodeStartsWithPrefix(children?.name, THEME_PREFIXES.RADIUS)) {
        const radiusToken = children.name.replace(THEME_PREFIXES.RADIUS, '');
        this.data[radiusToken] = convertPxToRem(children.cornerRadius);
      }
    });

    return this.data;
  };
}
