import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem } from './utils';

export class TextsPairings extends Page {
  constructor() {
    super(PAGE_IDS.TEXTS_PAIRINGS);
  }

  get = () => {
    this.traversePage((node: FrameNode) => {
      if (
        this.nodeStartsWithPrefix(
          node.name,
          THEME_PREFIXES.TEXTS_PAIRINGS.DEFAULT,
        )
      ) {
        const textPairingToken = node.name.replace(
          new RegExp(
            `${THEME_PREFIXES.TEXTS_PAIRINGS.DESKTOP}|${THEME_PREFIXES.TEXTS_PAIRINGS.MOBILE}|${THEME_PREFIXES.TEXTS_PAIRINGS.DEFAULT}`,
          ),
          '',
        );
        const labelTextNode = (node.children[0] as InstanceNode)
          .children[0] as TextNode;
        const labelNodeToken = labelTextNode.name.replace(
          new RegExp(
            `${THEME_PREFIXES.TEXTS.DESKTOP}|${THEME_PREFIXES.TEXTS.MOBILE}|${THEME_PREFIXES.TEXTS.DEFAULT}`,
          ),
          '',
        );
        const subLabelTextNode = (node.children[1] as InstanceNode)
          .children[0] as TextNode;
        const subLabelNodeToken = subLabelTextNode.name.replace(
          new RegExp(
            `${THEME_PREFIXES.TEXTS.DESKTOP}|${THEME_PREFIXES.TEXTS.MOBILE}|${THEME_PREFIXES.TEXTS.DEFAULT}`,
          ),
          '',
        );
        const isDesktopText = node.name.startsWith(
          THEME_PREFIXES.TEXTS_PAIRINGS.DESKTOP,
        );
        const isMobileText = node.name.startsWith(
          THEME_PREFIXES.TEXTS_PAIRINGS.MOBILE,
        );

        if (!this.data[textPairingToken]) {
          this.data[textPairingToken] = {
            label: { variant: labelNodeToken },
            subLabel: { variant: subLabelNodeToken },
            columnGap: {},
          };
        }

        const itemSpacing = convertPxToRem(node.itemSpacing);

        if (isDesktopText) {
          this.data[textPairingToken].columnGap.md = itemSpacing;
        } else if (isMobileText) {
          this.data[textPairingToken].columnGap.sm = itemSpacing;
        } else {
          this.data[textPairingToken] = {
            ...this.data[textPairingToken],
            columnGap: {
              sm: itemSpacing,
              md: itemSpacing,
            },
          };
        }
      }
    });

    return { parts: ['label', 'subLabel'], variants: this.data };
  };
}
