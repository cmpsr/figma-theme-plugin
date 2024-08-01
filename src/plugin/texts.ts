import { BREAKPOINTS, PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { Unit } from './types';
import { convertPxToRem, normalizeTextFontWeight, normalizeTextSuffixToken } from './utils';

export class Texts extends Page {
  constructor() {
    super(PAGE_IDS.TEXTS);
  }

  private normalizeTextStyles(textNode: TextNode) {
    const textStyle = figma.getStyleById(textNode.textStyleId as string) as TextStyle;
    const { fontSize, fontName, letterSpacing, textDecoration } = textStyle;
    const lineHeight = textStyle.lineHeight as Unit;
    const isFontStyleItalic = /italic/i.test(fontName.style);

    return {
      color: 'text-primary',
      fontSize: convertPxToRem(fontSize),
      fontWeight: textNode.fontWeight || normalizeTextFontWeight(fontName.style),
      letterSpacing: convertPxToRem(letterSpacing.value),
      lineHeight: convertPxToRem(lineHeight.value),
      textDecoration: textDecoration.toLowerCase() || 'none',
      fontFamily: fontName.family,
      fontStyle: isFontStyleItalic ? 'italic' : 'normal',
    };
  }

  private setResponsiveTextStyles(token: string, textNode: TextNode, breakpoint: string) {
    const textStylesNormalized = this.normalizeTextStyles(textNode);
    this.data[token] = this.addTextStyleBreakpoint({
      previousTextStyles: this.data[token],
      newTextStyles: textStylesNormalized,
      breakpoint,
    });
  }

  private dedupeResponsiveTextStyles() {
    for (let textVariant in this.data) {
      for (let textStyle in this.data[textVariant]) {
        const baseTextStyles = this.data[textVariant][textStyle][BREAKPOINTS.BASE];
        const largeTextStyles = this.data[textVariant][textStyle][BREAKPOINTS.LARGE];
        if (baseTextStyles && largeTextStyles && baseTextStyles === largeTextStyles) {
          this.data[textVariant][textStyle] = baseTextStyles;
        }
      }
    }
  }

  private addTextStyleBreakpoint({ previousTextStyles = undefined, newTextStyles, breakpoint }) {
    return Object.keys(newTextStyles).reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue]: {
          ...previousTextStyles?.[currentValue],
          [breakpoint]: newTextStyles[currentValue],
        },
      }),
      {}
    );
  }

  public get() {
    this.traversePage((node: SceneNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.TEXTS.DEFAULT)) {
        const textNode = node as TextNode;
        const textNodeNameNormalized = normalizeTextSuffixToken(textNode.name);

        const isDesktopText = textNodeNameNormalized.startsWith(THEME_PREFIXES.TEXTS.DESKTOP);
        const isMobileText = textNodeNameNormalized.startsWith(THEME_PREFIXES.TEXTS.MOBILE);
        const isLinkText = textNodeNameNormalized.startsWith(THEME_PREFIXES.TEXTS.LINK);
        const defaultTextToken = textNodeNameNormalized.replace(THEME_PREFIXES.TEXTS.DEFAULT, '');
        const mobileTextToken = textNodeNameNormalized.replace(THEME_PREFIXES.TEXTS.MOBILE, '');
        const desktopTextToken = textNodeNameNormalized.replace(THEME_PREFIXES.TEXTS.DESKTOP, '');

        if (isLinkText) {
          this.data[defaultTextToken] = {
            ...this.normalizeTextStyles(textNode),
            color: 'text-link-accent-default',
          };
        } else if (isMobileText) {
          this.setResponsiveTextStyles(mobileTextToken, textNode, BREAKPOINTS.BASE);
        } else if (isDesktopText) {
          this.setResponsiveTextStyles(desktopTextToken, textNode, BREAKPOINTS.LARGE);
        } else {
          this.data[defaultTextToken] = this.normalizeTextStyles(textNode);
        }
      }
    });
    this.dedupeResponsiveTextStyles();
    return this.data;
  }
}
