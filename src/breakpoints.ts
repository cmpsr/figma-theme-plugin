import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Breakpoints extends Page {
  constructor() {
    super(PAGE_IDS.BREAKPOINTS);
  }

  get = () => {
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.BREAKPOINTS)) {
        const breakpointToken = node.name.replace(THEME_PREFIXES.BREAKPOINTS, '');
        this.data[breakpointToken] = convertPxToRem(node.width);
      }
    });
    // We need to hardcode base and xxl tokens to avoid issues with default chakra breakpoints
    this.data['base'] = '0rem';
    this.data['xxl'] = this.data['2xl'];

    return this.data;
  };
}
