import { Colors } from './colors';
import { Elevations } from './elevations';
import { Radius } from './radius';
import { Spacings } from './spacings';
import { Texts } from './texts';

/* 
  NOTES
  1. Elevations will require extra job an render order to be correct in order to transform effect layer to box-shadow
  2. Spacings will require text layer to have the proper naming in order to extract the 
     value because we can't track spacer-0 from a rectangle
  3. Convert units to pixels or rems? Right now spacings for example are pixels without the unit
  

*/
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

console.log({
  colors,
  space: spacings,
  radii: radius,
  shadows: elevations,
  textStyles: texts,
});
// figma.showUI(__html__, { visible: false });
// figma.ui.postMessage({
//   action: 'download',
//   payload: { colors },
// });

// figma.closePlugin();
