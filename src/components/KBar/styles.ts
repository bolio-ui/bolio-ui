import { BolioUIThemes } from 'core'

export default function generateStyles(theme?: BolioUIThemes) {
  return {
    container: {
      maxWidth: '500px',
      width: '100%',
      background: theme?.palette?.accents_1,
      color: theme?.palette?.foreground,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: theme?.expressiveness?.shadowMedium
    },
    result: {
      maxHeight: 400,
      paddingBottom: '8px',
      overflow: 'auto'
    }
  }
}
