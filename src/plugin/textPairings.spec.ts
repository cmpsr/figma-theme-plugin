import { TextsPairings } from './textsPairings';

const mockGetNodeById = jest.fn();
Object.defineProperty(global, 'figma', {
  value: {
    editorType: 'figma',
    getNodeById: mockGetNodeById,
  },
  writable: true,
  configurable: true,
});

describe('TextsPairings', () => {
  beforeEach(() => {
    mockGetNodeById.mockReset();
  });

  it('should return a correctly structured data object for valid input nodes', () => {
    mockGetNodeById.mockImplementationOnce(() => ({
      children: [
        {
          name: 'textpairing-desktop-textpairing-header-4XL',
          itemSpacing: 16,
          children: [
            {
              name: 'Header-Desktop / Header-4XL',
              children: [{ name: 'text-desktop-text-header-4xl' }],
            },
            {
              name: 'Body / Display / Display S',
              children: [{ name: 'text-text-body-display-s' }],
            },
          ],
        },
        {
          name: 'textpairing-mobile-textpairing-header-4XL',
          itemSpacing: 10,
          children: [
            {
              name: 'Header-Mobile / Header-4XL',
              children: [{ name: 'text-mobile-text-header-3xl' }],
            },
            {
              name: 'Body / Display / Display S',
              children: [{ name: 'text-text-body-display-xs' }],
            },
          ],
        },
      ],
    }));

    const instance = new TextsPairings();
    const result = instance.get();

    expect(result).toEqual({
      parts: ['label', 'subLabel', 'container'],
      variants: {
        'textpairing-header-4XL': {
          container: {
            gap: { base: '0.625rem', md: '1.000rem' },
          },
          label: {
            variant: {
              base: 'text-header-3XL',
              md: 'text-header-4XL',
            },
          },
          subLabel: {
            variant: {
              base: 'text-body-display-XS',
              md: 'text-body-display-S',
            },
          },
        },
      },
    });
  });

  it('should simplify variant properties when identical across breakpoints', () => {
    mockGetNodeById.mockImplementationOnce(() => ({
      children: [
        {
          name: 'textpairing-desktop-textpairing-header-4XL',
          itemSpacing: 16,
          children: [
            {
              name: 'Header-Desktop / Header-4XL',
              children: [{ name: 'text-desktop-text-header-4xl' }],
            },
            {
              name: 'Body / Display / Display S',
              children: [{ name: 'text-text-body-display-s' }],
            },
          ],
        },
        {
          name: 'textpairing-mobile-textpairing-header-4XL',
          itemSpacing: 16,
          children: [
            {
              name: 'Header-Mobile / Header-4XL',
              children: [{ name: 'text-mobile-text-header-4xl' }],
            },
            {
              name: 'Body / Display / Display S',
              children: [{ name: 'text-text-body-display-s' }],
            },
          ],
        },
      ],
    }));

    const instance = new TextsPairings();
    const result = instance.get();

    expect(result).toEqual({
      parts: ['label', 'subLabel', 'container'],
      variants: {
        'textpairing-header-4XL': {
          container: {
            gap: '1.000rem',
          },
          label: {
            variant: 'text-header-4XL',
          },
          subLabel: {
            variant: 'text-body-display-S',
          },
        },
      },
    });
  });
  it('should simplify variant properties when only one breakpoint value is present', () => {
    mockGetNodeById.mockImplementationOnce(() => ({
      children: [
        {
          name: 'textpairing-mobile-textpairing-header-4XL',
          itemSpacing: 16,
          children: [
            {
              name: 'Header-Mobile / Header-4XL',
              children: [{ name: 'text-mobile-text-header-4xl' }],
            },
            {
              name: 'Body / Display / Display S',
              children: [{ name: 'text-text-body-display-s' }],
            },
          ],
        },
      ],
    }));

    const instance = new TextsPairings();
    const result = instance.get();

    expect(result).toEqual({
      parts: ['label', 'subLabel', 'container'],
      variants: {
        'textpairing-header-4XL': {
          container: {
            gap: '1.000rem',
          },
          label: {
            variant: 'text-header-4XL',
          },
          subLabel: {
            variant: 'text-body-display-S',
          },
        },
      },
    });
  });
});
