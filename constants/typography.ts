import type { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 24,
    lineHeight: 30,
  } satisfies TextStyle,

  h2: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 17,
    lineHeight: 22,
  } satisfies TextStyle,

  body: {
    fontFamily: 'Fraunces-Regular',
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,

  label: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  mono: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
  } satisfies TextStyle,
} as const;
