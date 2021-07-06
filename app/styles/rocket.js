import { StyleSheet } from "react-native"

/**
 * On Android bold font variant will be used for anything with weight 500 or above, regular otherwise.
 */
const fontWeights = Object.freeze({
  thin: "100",
  ultraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  heavy: "800",
  black: "900"
})


const colours = Object.freeze({
  background: '#FFFFFF',
  titleLight: '#FFFFFF',
  titleDark: '#15202B',
  titleGrey: '#646E77',
  titleLightGrey: '#ABAEB1',
  subheadlineLight: '#FFFFFF',
  subheadlineDark: '#15202B',
  subheadlineGrey: '#727579',
  footnote: '#727579',
  caption: '#727579',
  placeholder: '#705FFF',
  link: '#705FFF',
  light: '#FFFFFF',
  dark: '#15202B',
  yellow: '#E9FF5F',
  navigationBar: '#15202B',
  lightSlate: '#25323F',
  inactive: '#CDCFD0',
  border: '#E0E0E0',
  highlight: '#705FFF',
})

const text = StyleSheet.create({

  // Light/Dark/Placeholder styles for overriding defaults
  light: { color: colours.light },
  dark: { color: colours.dark },
  placeholder: { color: colours.placeholder },
  grey: { color: colours.titleGrey },
  bodyGrey: { color: colours.subheadlineGrey },
  yellow: { color: colours.yellow },

  // Main metric on the Home Screen 
  hero: {
    backgroundColor: 'transparent',
    color: colours.light,
    fontSize: 64,
    fontWeight: fontWeights.bold,
    lineHeight: 70,
    letterSpacing: -0.5,
  },

  // Screen titles e.g. Large navigation bar titles 
  title1: {
    backgroundColor: 'transparent',
    color: colours.dark,
    fontSize: 30,
    fontWeight: fontWeights.medium,
    lineHeight: 35,
    letterSpacing: -0.3,
  },

  // Component titles e.g. Trip summary title on checkout
  title2: {
    backgroundColor: 'transparent',
    color: colours.dark,
    fontSize: 25,
    fontWeight: fontWeights.medium,
    lineHeight: 30,
  },

  // Small component titles
  title3: {
    backgroundColor: 'transparent',
    color: colours.dark,
    fontSize: 18,
    fontWeight: fontWeights.medium,
    lineHeight: 22,
  },

  subheadline: {
    backgroundColor: 'transparent',
    color: colours.subheadlineDark,
    fontSize: 15,
    fontWeight: fontWeights.medium,
    lineHeight: 22,
    letterSpacing: -0.1,
  },

  body: {
    backgroundColor: 'transparent',
    color: colours.dark,
    fontSize: 15,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
    letterSpacing: -0.1,
  },

  headerButton: {
    backgroundColor: 'transparent',
    color: colours.dark,
    fontSize: 18,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
    letterSpacing: -0.1,
  },

  footnote: {
    backgroundColor: 'transparent',
    color: colours.footnote,
    fontSize: 13,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
    letterSpacing: -0.1,
  },

  captionSmall: {
    backgroundColor: 'transparent',
    color: colours.caption,
    fontSize: 10,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
    letterSpacing: -0.1,
  },

  placeholder: {
    backgroundColor: 'transparent',
    color: colours.placeholder,
    fontSize: 15,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
})


const rocket = Object.freeze({
  colours: colours,
  text: text,
  weights: fontWeights,
})

export default rocket