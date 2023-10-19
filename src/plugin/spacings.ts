import { LOCAL_VARIABLES_PREFIXES, PAGE_IDS } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Spacings extends Page {
  private modeId: string;

  constructor(modeId: string) {
    super(PAGE_IDS.SPACINGS);
    this.modeId = modeId;
  }

  public get(): Record<string, string> {
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
}
