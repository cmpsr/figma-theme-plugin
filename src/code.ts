import { Colors } from './colors';
import { Elevations } from './elevations';
import { Radius } from './radius';
import { Spacings } from './spacings';
import { Texts } from './texts';
import { TextsPairings } from './textsPairings';

try {
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

  figma.notify('Theme has been extracted successfully ✅', { timeout: 3000 });
} catch (error) {
  figma.notify('Something went wrong', { timeout: 3000, error: true });
} finally {
  // figma.closePlugin();
}

// figma.showUI(__html__, { visible: true });
// figma.ui.postMessage({
//   action: 'download',
//   payload: {},
// });
