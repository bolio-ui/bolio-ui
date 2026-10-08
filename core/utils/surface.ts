import { BolioUIThemes } from '../Themes/Presets'

// The colors of a popup that floats over the page. On a dark page the popup
// is a surface lighter than the page and its hover goes one step lighter
// still. As in other libraries, the edge is a hairline of light that matches
// the surface (no visible line) under a tight and a wide black shadow.
export const getSurface = (
  theme: BolioUIThemes,
  shadow: string = theme.expressiveness.shadowMedium
) => {
  const dark = theme.type === 'dark'
  return {
    bg: dark ? theme.palette.accents_3 : theme.palette.background,
    hover: dark ? theme.palette.accents_4 : theme.palette.accents_2,
    shadow: dark
      ? `0 0 0 1px rgb(255 255 255 / 6%), 0 2px 6px rgb(0 0 0 / 40%), ${shadow}`
      : shadow
  }
}
