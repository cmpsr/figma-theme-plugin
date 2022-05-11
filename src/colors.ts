import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';

const enum FigmaPaintType {
  Solid = 'SOLID',
  GradientLinear = 'GRADIENT_LINEAR',
}

export class Colors extends Page {
  constructor() {
    super(PAGE_IDS.COLORS);
  }
  componentToHex = (c: number) => {
    const transformNumber = Number((c * 255).toFixed());
    const hex = transformNumber.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };

  rgbToHex = ({ r, g, b }: RGBA) =>
    `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(
      b,
    )}`.toUpperCase();

  getAngleFromGradientTransform = (paint: Paint) => {
    const { gradientTransform, gradientStops } = paint as GradientPaint;
    if (!gradientTransform || !gradientStops) {
      return '';
    }
    let gradientTransformData = {
      m00: 1,
      m01: 0,
      m02: 0,
      m10: 0,
      m11: 1,
      m12: 0,
    };
    const delta =
      gradientTransform[0][0] * gradientTransform[1][1] -
      gradientTransform[0][1] * gradientTransform[1][0];
    if (delta !== 0) {
      const deltaVal = 1 / delta;
      gradientTransformData = {
        m00: gradientTransform[1][1] * deltaVal,
        m01: -gradientTransform[0][1] * deltaVal,
        m02:
          (gradientTransform[0][1] * gradientTransform[1][2] -
            gradientTransform[1][1] * gradientTransform[0][2]) *
          deltaVal,
        m10: -gradientTransform[1][0] * deltaVal,
        m11: gradientTransform[0][0] * deltaVal,
        m12:
          (gradientTransform[1][0] * gradientTransform[0][2] -
            gradientTransform[0][0] * gradientTransform[1][2]) *
          deltaVal,
      };
    }
    const rotationTruthy =
      gradientTransformData.m00 * gradientTransformData.m11 -
        gradientTransformData.m01 * gradientTransformData.m10 >
      0
        ? 1
        : -1;
    let rotationData = ((data, param: { x: number; y: number }) => ({
      x: data.m00 * param.x + data.m01 * param.y,
      y: data.m10 * param.x + data.m11 * param.y,
    }))(gradientTransformData, { x: 0, y: 1 });

    return (
      (Math.atan2(
        rotationData.y * rotationTruthy,
        rotationData.x * rotationTruthy,
      ) /
        Math.PI) *
      180
    ).toFixed(2);
  };

  getLinearGradient = (paint: GradientPaint) => {
    const { gradientStops } = paint;
    const degree = this.getAngleFromGradientTransform(paint);
    const colorStopList = gradientStops.map((gradientStop) => {
      const rgbColor = this.rgbToHex(gradientStop.color);
      const linearColorStop = (gradientStop.position * 100).toFixed(2);
      return `${rgbColor} ${linearColorStop}%`;
    });

    return `linear-gradient(${degree}deg, ${colorStopList.join(', ')})`;
  };

  convertPaintToCss = (paint: Paint) => {
    switch (paint.type) {
      case FigmaPaintType.Solid:
        return this.rgbToHex(paint?.color as RGBA);
      case FigmaPaintType.GradientLinear:
        return this.getLinearGradient(paint as GradientPaint);
      default:
        return null;
    }
  };

  get = () => {
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.COLORS)) {
        const colorNode = node as RectangleNode | VectorNode;
        const colorToken = colorNode.name.replace(THEME_PREFIXES.COLORS, '');
        const paint = colorNode.fills?.[0] as Paint;
        this.data[colorToken] = this.convertPaintToCss(paint);
      }
    });

    return this.data;
  };
}
