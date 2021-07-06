import { StyleSheet } from "react-native"
import colours from "app/styles/colours"


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

const textColours = Object.freeze({
  body: colours.body,
  heading: colours.title,
  buttonTitle: colours.white,
  subheading: colours.subheading,
  caption: '#686868'
})

const textStyles = StyleSheet.create({
  // longer bodies of text, such as project details
  body: {
    backgroundColor: "transparent",
    color: textColours.body,
    fontSize: 16,
    fontWeight: fontWeights.regular,
    lineHeight: 22,
    // letterSpacing: -0.2,
  },
  smallBody: {
    backgroundColor: "transparent",
    color: textColours.body,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  largeBody: {
    backgroundColor: "transparent",
    color: textColours.body,
    fontSize: 18,
    fontWeight: fontWeights.regular,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  h1: {
    backgroundColor: "transparent",
    color: textColours.heading,
    fontSize: 36,
    fontWeight: fontWeights.bold,
    lineHeight: 40
  },
  h2: {
    backgroundColor: "transparent",
    color: textColours.heading,
    fontSize: 24,
    fontWeight: fontWeights.bold,
    lineHeight: 28
  },
  h3: {
    backgroundColor: "transparent",
    color: textColours.black,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 22
  },
  h4: {
    backgroundColor: "transparent",
    color: textColours.subheading,
    fontSize: 17,
    fontWeight: fontWeights.regular,
    lineHeight: 20
  },
  h5: {
    backgroundColor: "transparent",
    color: textColours.subheading,
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    lineHeight: 20
  },
  h6: {
    backgroundColor: "transparent",
    color: textColours.caption,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    lineHeight: 18
  },
  caption: {
    backgroundColor: "transparent",
    color: textColours.black,
    fontSize: 12,
    fontWeight: fontWeights.light,
    lineHeight: 16,
    letterSpacing: -0.2,
  },
  buttonTitle: {
    backgroundColor: "transparent",
    color: textColours.buttonTitle,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 22
  },
  buttonTitleSmall: {
    backgroundColor: "transparent",
    color: textColours.black,
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    lineHeight: 18
  },
  headerButtonTitle: {
    color: textColours.black,
    fontSize: 17,
    fontWeight: fontWeights.medium,
  },
  impact: {
    backgroundColor: "transparent",
    color: textColours.heading,
    fontSize: 42,
    fontWeight: fontWeights.bold,
  },
})

export { fontWeights, textStyles, textColours }
