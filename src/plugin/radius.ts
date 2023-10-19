import { LOCAL_VARIABLES_PREFIXES, PAGE_IDS } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Radius extends Page {
  private modeId: string;

  constructor(modeId: string) {
    super(PAGE_IDS.RADIUS);
    this.modeId = modeId;
  }

  public get(): Record<string, string> {
    this.getLocalVariables().forEach((variable) => {
      if (variable.name.startsWith(LOCAL_VARIABLES_PREFIXES.RADIUS)) {
        const radiusToken = variable.name.split('/').pop();

        if (variable.valuesByMode[this.modeId]) {
          const radiiValue = variable.valuesByMode[this.modeId];
          const radiiValueRem = convertPxToRem(radiiValue as number);
          this.data[radiusToken] = radiiValueRem;
        } else {
          console.warn(`No radii value found for modeId: ${this.modeId} in variable: ${variable.name}`);
        }
      }
    });

    return this.data;
  }
}
