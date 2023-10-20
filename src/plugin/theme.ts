import { Breakpoints } from './breakpoints';
import { Colors } from './colors';
import { Elevations } from './elevations';
import { Radius } from './radius';
import { Spacings } from './spacings';
import { Texts } from './texts';
import { TextsPairings } from './textsPairings';

export class Theme {
  private breakpoints: {};
  private colors: {};
  private spacings: {};
  private radius: {};
  private elevations: {};
  private texts: {};
  private textsPairings: { parts: string[]; variants: {} };

  constructor(modeId: string) {
    this.breakpoints = new Breakpoints(modeId).get();
    this.colors = new Colors(modeId).get();
    this.spacings = new Spacings(modeId).get();
    this.radius = new Radius(modeId).get();
    this.elevations = new Elevations().get();
    this.texts = new Texts().get();
    this.textsPairings = new TextsPairings().get();
  }

  public get() {
    return {
      breakpoints: this.breakpoints,
      colors: this.colors,
      space: this.spacings,
      radii: this.radius,
      shadows: this.elevations,
      textStyles: this.texts,
      components: {
        TextPairing: this.textsPairings,
      },
    };
  }
}
