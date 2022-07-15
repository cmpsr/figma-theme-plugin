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

  getTextStyles = (textStyle: TextStyle) => {
    const { fontSize, fontName, letterSpacing, textDecoration } = textStyle;
    const normalizedFontWeight = normalizeTextFontWeight(fontName.style);
    const lineHeight = textStyle.lineHeight as Unit;
    return {
      color: 'text-primary',
      fontSize: [convertPxToRem(fontSize)],
      fontWeight: [normalizedFontWeight],
      letterSpacing: [convertPxToRem(letterSpacing.value)],
      lineHeight: [convertPxToRem(lineHeight.value)],
      textDecoration: [textDecoration.toLowerCase() || 'none'],
    };
  };

  setResponsiveTextStyles = (token: string, textStyle: TextStyle) => {
    const { fontSize, fontName, letterSpacing, textDecoration } = textStyle;
    const normalizedFontWeight = normalizeTextFontWeight(fontName.style);

    const lineHeight = textStyle.lineHeight as Unit;
    if (this.data[token]) {
      this.data[token].fontWeight.unshift(normalizedFontWeight, null, null);
      this.data[token].letterSpacing.unshift(
        convertPxToRem(letterSpacing.value),
        null,
        null,
      );
      this.data[token].fontSize.unshift(convertPxToRem(fontSize), null, null);
      this.data[token].lineHeight.unshift(
        convertPxToRem(lineHeight.value),
        null,
        null,
      );
      this.data[token].textDecoration.unshift(
        textDecoration.toLowerCase(),
        null,
        null,
      );
    } else {
      this.data[token] = this.getTextStyles(textStyle);
    }
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
            ...this.getTextStyles(textStyle),
            color: 'text-link-accent-default',
          };
        } else if (isMobileText) {
          this.setResponsiveTextStyles(mobileTextToken, textStyle);
        } else if (isDesktopText) {
          this.setResponsiveTextStyles(desktopTextToken, textStyle);
        } else {
          this.data[defaultTextToken] = this.getTextStyles(textStyle);
        }
      }
    });
    return this.data;
  };
}
