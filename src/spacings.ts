import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Spacings extends Page {
  constructor() {
    super(PAGE_IDS.SPACINGS);
  }

  get = () => {
    this.traversePage((children: any) => {
      if (this.nodeStartsWithPrefix(children?.name, THEME_PREFIXES.SPACINGS)) {
        const spacingToken = children.name.replace(THEME_PREFIXES.SPACINGS, '');
        this.data[spacingToken] = convertPxToRem(children.width);
      }
    });

    // We need to hardcode spacer-0 token because figma doesn't allow to define a rectangle with 0 width
    this.data['spacer-0'] = '0rem';

    return this.data;
  };
}
