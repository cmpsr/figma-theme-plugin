import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { Unit } from './types';
import {
  convertPxToRem,
  normalizeTextFontWeight,
  normalizeTextSuffixToken,
} from './utils';

export class Texts extends Page {
  constructor() {
    super(PAGE_IDS.TEXTS);
  }

  normalizeTextStyles = (textStyle: TextStyle) => {
    const { fontSize, fontName, letterSpacing, textDecoration } = textStyle;
    const normalizedFontWeight = normalizeTextFontWeight(fontName.style);
    const lineHeight = textStyle.lineHeight as Unit;
    return {
      color: 'text-primary',
      fontSize: convertPxToRem(fontSize),
      fontWeight: normalizedFontWeight,
      letterSpacing: convertPxToRem(letterSpacing.value),
      lineHeight: convertPxToRem(lineHeight.value),
      textDecoration: textDecoration.toLowerCase() || 'none',
      fontFamily: fontName.family,
    };
  };

  setResponsiveTextStyles = (
    token: string,
    textStyles: TextStyle,
    breakpoint: string,
  ) => {
    const textStylesNormalized = this.normalizeTextStyles(textStyles);
    if (this.data[token]) {
      this.data[token] = this.addTextStyleBreakpoint(
        this.data[token],
        textStylesNormalized,
        breakpoint,
      );
    } else {
      this.data[token] = this.createTextStyleBreakpoint(
        textStylesNormalized,
        breakpoint,
      );
    }
  };

  createTextStyleBreakpoint = (textStyles, breakpoint) => {
    let textStyleWithBreakpoint = {};
    for (let key in textStyles) {
      textStyleWithBreakpoint[key] = {};
      textStyleWithBreakpoint[key][breakpoint] = textStyles[key];
    }
    return textStyleWithBreakpoint;
  };

  addTextStyleBreakpoint = (previousTextStyles, newTextStyles, breakpoint) => {
    for (let key in previousTextStyles) {
      previousTextStyles[key][breakpoint] = newTextStyles[key];
    }
    return previousTextStyles;
  };

  get = () => {
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.TEXTS.DEFAULT)) {
        const textNode = node as TextNode;
        const textNodeNameNormalized = normalizeTextSuffixToken(textNode.name);
        const textStyle = figma.getStyleById(
          textNode.textStyleId as string,
        ) as TextStyle;

        const isDesktopText = textNodeNameNormalized.startsWith(
          THEME_PREFIXES.TEXTS.DESKTOP,
        );
        const isMobileText = textNodeNameNormalized.startsWith(
          THEME_PREFIXES.TEXTS.MOBILE,
        );
        const isLinkText = textNodeNameNormalized.startsWith(
          THEME_PREFIXES.TEXTS.LINK,
        );
        const defaultTextToken = textNodeNameNormalized.replace(
          THEME_PREFIXES.TEXTS.DEFAULT,
          '',
        );
        const mobileTextToken = textNodeNameNormalized.replace(
          THEME_PREFIXES.TEXTS.MOBILE,
          '',
        );
        const desktopTextToken = textNodeNameNormalized.replace(
          THEME_PREFIXES.TEXTS.DESKTOP,
          '',
        );

        if (isLinkText) {
          this.data[defaultTextToken] = {
            ...this.normalizeTextStyles(textStyle),
            color: 'text-link-accent-default',
          };
        } else if (isMobileText) {
          this.setResponsiveTextStyles(mobileTextToken, textStyle, 'base');
        } else if (isDesktopText) {
          this.setResponsiveTextStyles(desktopTextToken, textStyle, 'lg');
        } else {
          this.data[defaultTextToken] = this.normalizeTextStyles(textStyle);
        }
      }
    });
    return this.data;
  };
}
