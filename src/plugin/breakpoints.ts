import { LOCAL_VARIABLES_PREFIXES, PAGE_IDS } from './constants';
import { Page } from './page';

export class Breakpoints extends Page {
  private modeId: string;

  constructor(modeId: string) {
    super(PAGE_IDS.BREAKPOINTS);
    this.modeId = modeId;
  }

  public get(): Record<string, string> {
    this.getLocalVariables().forEach((variable) => {
      if (variable.name.startsWith(LOCAL_VARIABLES_PREFIXES.BREAKPOINTS)) {
        const breakpointToken = variable.name.split('/').pop();

        if (variable.valuesByMode[this.modeId]) {
          const breakpointValue = variable.valuesByMode[this.modeId];
          this.data[breakpointToken] = `${breakpointValue}px`;
        } else {
          console.warn(`No breakpoint value found for modeId: ${this.modeId} in variable: ${variable.name}`);
        }
      }
    });
    // Manually aggregate base/xxl tokens to avoid issues with default chakra breakpoints
    this.data['base'] = '0px';
    this.data['xxl'] = this.data['2xl'];

    return this.data;
  }
}
