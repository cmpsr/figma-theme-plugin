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
            container: { gap: {} },
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

        this.data[textPairingToken].container.gap[sizeSuffix] = itemSpacing;
      }
    });

    this.simplifyDataStructure();

    return { parts: ['label', 'subLabel', 'container'], variants: this.data };
  }

  // Simplifies the data structure by reducing variants to single values when identical across breakpoints or when only one breakpoint value is present.
  private simplifyDataStructure() {
    Object.keys(this.data).forEach((token) => {
      this.simplifyVariantProperties(token, 'label');
      this.simplifyVariantProperties(token, 'subLabel');
      this.simplifyContainerGap(token);
    });
  }

  private simplifyVariantProperties(token: string, property: 'label' | 'subLabel') {
    const item = this.data[token][property];

    if (item.variant) {
      const { base, md } = item.variant;

      if (base === md || !md) {
        this.data[token][property].variant = base;
      }
    }
  }

  private simplifyContainerGap(token: string) {
    const gap = this.data[token].container.gap;

    if (typeof gap !== 'string' && (gap.base === gap.md || !gap.md || !gap.base)) {
      const definedGapValue = gap.base || gap.md;
      this.data[token].container.gap = definedGapValue;
    }
  }
}
