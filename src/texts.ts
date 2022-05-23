import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { Unit } from './types';
import { convertPxToRem } from './utils';

export class Texts extends Page {
  constructor() {
    super(PAGE_IDS.TEXTS);
  }

  getTextStyles = (textStyle: TextStyle) => {
    const { fontSize, fontName, letterSpacing, textDecoration } = textStyle;
    const lineHeight = textStyle.lineHeight as Unit;
    return {
      color: 'text-primary',
      fontSize: [convertPxToRem(fontSize)],
      fontWeight: [fontName.style.toLowerCase() || 'normal'],
      letterSpacing: [convertPxToRem(letterSpacing.value)],
      lineHeight: [convertPxToRem(lineHeight.value)],
      textDecoration: [textDecoration.toLowerCase() || 'none'],
    };
  };

  setResponsiveTextStyles = (token: string, textStyle: TextStyle) => {
    const { fontSize, fontName, letterSpacing, textDecoration } = textStyle;
    const lineHeight = textStyle.lineHeight as Unit;
    if (this.data[token]) {
      this.data[token].fontWeight.unshift(
        fontName.style.toLowerCase() || 'normal',
        null,
        null,
      );
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
        const textStyle = figma.getStyleById(
          textNode.textStyleId as string,
        ) as TextStyle;

        const isDesktopText = textNode.name.startsWith(
          THEME_PREFIXES.TEXTS.DESKTOP,
        );
        const isMobileText = textNode.name.startsWith(
          THEME_PREFIXES.TEXTS.MOBILE,
        );
        const isLinkText = textNode.name.startsWith(THEME_PREFIXES.TEXTS.LINK);
        const defaultTextToken = textNode.name.replace(
          THEME_PREFIXES.TEXTS.DEFAULT,
          '',
        );
        const mobileTextToken = textNode.name.replace(
          THEME_PREFIXES.TEXTS.MOBILE,
          '',
        );
        const desktopTextToken = textNode.name.replace(
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
