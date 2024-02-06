import { PAGE_IDS, THEME_PREFIXES } from './constants';
import { Page } from './page';
import { convertPxToRem, normalizeTextSuffixToken } from './utils';

export class TextsPairings extends Page {
  constructor() {
    super(PAGE_IDS.TEXTS_PAIRINGS);
  }

  public get() {
    const themePrefixRegex = new RegExp(
      `${THEME_PREFIXES.TEXTS_PAIRINGS.DESKTOP}|${THEME_PREFIXES.TEXTS_PAIRINGS.MOBILE}|${THEME_PREFIXES.TEXTS_PAIRINGS.DEFAULT}`
    );
    const textsPrefixRegex = new RegExp(
      `${THEME_PREFIXES.TEXTS.DESKTOP}|${THEME_PREFIXES.TEXTS.MOBILE}|${THEME_PREFIXES.TEXTS.DEFAULT}`
    );

    this.traversePage((node: FrameNode) => {
      if (this.nodeStartsWithPrefix(node.name, THEME_PREFIXES.TEXTS_PAIRINGS.DEFAULT)) {
        const textPairingToken = normalizeTextSuffixToken(node.name).replace(themePrefixRegex, '');

        if (!this.data[textPairingToken]) {
          this.data[textPairingToken] = {
            label: { variant: {} },
            subLabel: { variant: {} },
            columnGap: {},
          };
        }

        // Determine the responsive size suffix based on the node name.
        const sizeSuffix = node.name.startsWith(THEME_PREFIXES.TEXTS_PAIRINGS.DESKTOP) ? 'md' : 'base';
        const itemSpacing = convertPxToRem(node.itemSpacing);

        ['label', 'subLabel'].forEach((type, index) => {
          const textNode = (node.children[index] as InstanceNode).children[0] as TextNode;
          const textToken = normalizeTextSuffixToken(textNode.name).replace(textsPrefixRegex, '');

          this.data[textPairingToken][type].variant[sizeSuffix] = textToken;
        });

        this.data[textPairingToken].columnGap[sizeSuffix] = itemSpacing;
      }
    });

    this.simplifyDataStructure();

    return { parts: ['label', 'subLabel', 'container'], variants: this.data };
  }

  // Simplifies the data structure by reducing variants to single values when identical across breakpoints or when only one breakpoint value is present.
  private simplifyDataStructure() {
    Object.keys(this.data).forEach((token) => {
      Object.keys(this.data[token]).forEach((property) => {
        const item = this.data[token][property];
        let simplifiedValue: string | undefined;

        // Determine if the current item is a variant or directly a gap definition.
        if (item.variant) {
          simplifiedValue = this.getSimplifiedValue(item.variant.base, item.variant.md);
        } else {
          simplifiedValue = this.getSimplifiedValue(item.base, item.md);
        }

        if (simplifiedValue !== undefined) {
          this.data[token][property] = simplifiedValue;
        }
      });
    });
  }

  private getSimplifiedValue(base: string | undefined, md: string | undefined): string | undefined {
    // Return the value directly if both are the same or if only one is provided.
    if (base === md || !md) {
      return base;
    } else if (!base) {
      return md;
    }
    // Return undefined if no simplification is possible (both values differ).
    return undefined;
  }
}
