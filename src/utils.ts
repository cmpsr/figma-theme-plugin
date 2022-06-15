const rootFontSize = 16;
export const convertPxToRem = (pixel: number) => `${pixel / rootFontSize}rem`;

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
