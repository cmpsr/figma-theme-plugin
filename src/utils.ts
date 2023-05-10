const rootFontSize = 16;
export const convertPxToRem = (pixel: number, fixedDigits = 3) => {
  if (!pixel) return '0rem';

  const remFixed = (pixel / rootFontSize).toFixed(fixedDigits);
  return `${remFixed}rem`;
};

export const normalizeTextSuffixToken = (token: string) => {
  const SIZE_SUFFIX = {
    '-4xl': '-4XL',
    '-3xl': '-3XL',
    '-2xl': '-2XL',
    '-xl': '-XL',
    '-l': '-L',
    '-m': '-M',
    '-s': '-S',
    '-xs': '-XS',
  };

  const tokenSuffix = token.substring(token.lastIndexOf('-'), token.length);
  if (SIZE_SUFFIX[tokenSuffix]) {
    return (
      token.substring(0, token.lastIndexOf('-')) +
      SIZE_SUFFIX[tokenSuffix] +
      token.substring(token.lastIndexOf('-') + token.length)
    );
  } else {
    return token;
  }
};

export const normalizeTextFontWeight = (fontWeight: string) => {
  const fontWeightLowerCase = fontWeight.toLocaleLowerCase();
  const fontWeights = {
    thin: 100,
    'extra light': 200,
    extralight: 200,
    light: 300,
    normal: 400,
    regular: 400,
    medium: 500,
    md: 500,
    semibold: 600,
    'semi bold': 600,
    bold: 700,
    bd: 700,
    'extra bold': 800,
    'ultra bold': 900,
  };

  if (fontWeights[fontWeightLowerCase]) {
    return fontWeights[fontWeightLowerCase];
  } else {
    figma.notify(`We can't resolve the font weight style: ${fontWeight}`, {
      timeout: 3000,
      error: false,
    });
    return fontWeightLowerCase;
  }
};
