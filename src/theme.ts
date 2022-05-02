import { Colors } from './colors';
import { Elevations } from './elevations';
import { Radius } from './radius';
import { Spacings } from './spacings';
import { Texts } from './texts';
import { TextsPairings } from './textsPairings';

export class Theme {
  colors: {};
  spacings: {};
  radius: {};
  elevations: {};
  texts: {};
  textsPairings: { parts: string[]; variants: {} };

  constructor() {
    this.colors = new Colors().get();
    this.spacings = new Spacings().get();
    this.radius = new Radius().get();
    this.elevations = new Elevations().get();
    this.texts = new Texts().get();
    this.textsPairings = new TextsPairings().get();
  }

  get = () => ({
    colors: this.colors,
    space: this.spacings,
    radii: this.radius,
    shadows: this.elevations,
    textStyles: this.texts,
    components: {
      TextPairing: this.textsPairings,
    },
  });
}
