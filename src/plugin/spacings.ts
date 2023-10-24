import { LOCAL_VARIABLES_PREFIXES, PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Spacings extends Page {
  constructor(private modeId?: string) {
    super(PAGE_IDS.SPACINGS);
  }

  private getSpacingsByLocalVariables(): Record<string, string> {
    this.getLocalVariables().forEach((variable) => {
      if (variable.name.startsWith(LOCAL_VARIABLES_PREFIXES.SPACINGS)) {
        const spacingToken = variable.name.split('/').pop();

        if (variable.valuesByMode[this.modeId] !== undefined) {
          const spacingValue = variable.valuesByMode[this.modeId];
          const spacingValueRem = convertPxToRem(spacingValue as number);
          this.data[spacingToken] = spacingValueRem;
        } else {
          console.warn(`No spacing value found for modeId: ${this.modeId} in variable: ${variable.name}`);
        }
      }
    });

    return this.data;
  }

  private getSpacingsByTokens(): Record<string, string> {
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.SPACINGS)) {
        const spacingToken = node.name.replace(THEME_PREFIXES.SPACINGS, '');
        this.data[spacingToken] = convertPxToRem(node.width);
      }
    });

    // We need to hardcode spacer-0 token because figma doesn't allow to define a rectangle with 0 width
    this.data['spacer-0'] = '0rem';

    return this.data;
  }

  public get(): Record<string, string> {
    return this.modeId ? this.getSpacingsByLocalVariables() : this.getSpacingsByTokens();
  }
}
