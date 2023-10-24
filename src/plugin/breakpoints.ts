import { LOCAL_VARIABLES_PREFIXES, PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';

export class Breakpoints extends Page {
  private modeId?: string;

  constructor(modeId: string) {
    super(PAGE_IDS.BREAKPOINTS);
    this.modeId = modeId;
  }

  private setUniversalBreakpoints(): void {
    // Manually aggregate base/xxl tokens to avoid issues with default chakra breakpoints
    this.data['base'] = '0px';
    this.data['xxl'] = this.data['2xl'];
  }

  public getBreakpointsByTokens(): Record<string, string> {
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.BREAKPOINTS)) {
        const breakpointToken = node.name.replace(THEME_PREFIXES.BREAKPOINTS, '');
        this.data[breakpointToken] = `${node.width}px`;
      }
    });
    this.setUniversalBreakpoints();

    return this.data;
  }

  public getBreakpointsbyLocalVariables(): Record<string, string> {
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
    this.setUniversalBreakpoints();

    return this.data;
  }

  public get(): Record<string, string> {
    return this.modeId ? this.getBreakpointsbyLocalVariables() : this.getBreakpointsByTokens();
  }
}
