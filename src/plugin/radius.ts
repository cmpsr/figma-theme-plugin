import { LOCAL_VARIABLES_PREFIXES, PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class Radius extends Page {
  constructor(private modeId?: string) {
    super(PAGE_IDS.RADIUS);
  }

  private getRadiisByLocalVariables(): Record<string, string> {
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

  private getRadiisByTokens(): Record<string, string> {
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
  }

  public get(): Record<string, string> {
    return this.modeId ? this.getRadiisByLocalVariables() : this.getRadiisByTokens();
  }
}
