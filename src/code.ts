import { Colors } from './colors';
import { Elevations } from './elevations';
import { Radius } from './radius';
import { Spacings } from './spacings';
import { Texts } from './texts';
import { TextsPairings } from './textsPairings';

// Extract colors
const colors = new Colors().get();

// Extract spacings
const spacings = new Spacings().get();

// Extract radiius
const radius = new Radius().get();

// Extract elevations
const elevations = new Elevations().get();

// Extract texts
const texts = new Texts().get();

// Extract textsPairings
const textsPairings = new TextsPairings().get();

console.log({
  colors,
  space: spacings,
  radii: radius,
  shadows: elevations,
  textStyles: texts,
  components: {
    TextPairing: textsPairings,
  },
});
// figma.showUI(__html__, { visible: false });
// figma.ui.postMessage({
//   action: 'download',
//   payload: { colors },
// });

// figma.closePlugin();
