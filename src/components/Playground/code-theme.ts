import { PrismTheme } from 'prism-react-renderer'
import { BolioUIThemes } from 'core/Themes/Presets'

// Neutral surface (CssBaseline's own tokens), but each token category gets
// its own hue, like a real editor: JSX tags, attribute names, strings,
// keywords, numbers and function/component names are all distinct colors.
// On light themes the darker "Dark" token is used instead of the base one
// (the same pairing Card uses), since the base colors are tuned to sit on a
// dark surface as text and read too pale directly on a light one.
const makeCodeTheme = (theme: BolioUIThemes): PrismTheme => {
  const isDark = theme.type === 'dark'
  const pick = (base: string, darkerForLight: string) =>
    isDark ? base : darkerForLight

  const tag = pick(theme.palette.error, theme.palette.errorDark)
  const attrName = pick(theme.palette.info, theme.palette.infoDark)
  const string = pick(theme.palette.warning, theme.palette.warningDark)
  const keyword = pick(theme.palette.secondary, theme.palette.secondaryDark)
  const number = pick(theme.palette.primary, theme.palette.primaryDark)
  const func = pick(theme.palette.success, theme.palette.successDark)

  return {
    plain: {
      // Transparent on purpose: the Playground editor's own frame already
      // paints this same accents_1 surface behind the header and the code,
      // so the two don't end up as two slightly different-looking boxes.
      backgroundColor: 'transparent',
      color: theme.palette.foreground,
      fontWeight: '400',
      fontStyle: 'normal',
      fontFamily: theme.font.mono,
      fontSize: '.875rem',
      textRendering: 'geometricPrecision'
    },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: {
          color: theme.palette.accents_4,
          fontStyle: 'italic'
        }
      },
      {
        types: ['punctuation', 'operator'],
        style: {
          color: theme.palette.accents_5
        }
      },
      {
        types: ['namespace'],
        style: {
          opacity: 0.7
        }
      },
      // JSX/HTML element and component names: <Button>, <Grid.Container>
      {
        types: ['tag'],
        style: {
          color: tag
        }
      },
      // JSX/HTML prop names: type=, gap=, auto
      {
        types: ['attr-name'],
        style: {
          color: attrName
        }
      },
      // String and attribute values: "primary", '@bolio-ui/core'
      {
        types: ['attr-value', 'string', 'entity', 'url', 'char'],
        style: {
          color: string
        }
      },
      // Language keywords: import, from, return, const, function
      {
        types: [
          'keyword',
          'control',
          'directive',
          'statement',
          'at-rule',
          'placeholder',
          'language-javascript',
          'script'
        ],
        style: {
          color: keyword
        }
      },
      // Numbers, booleans and constants: 2, true, false, MY_CONST
      {
        types: ['boolean', 'number', 'unit', 'regex', 'constant'],
        style: {
          color: number
        }
      },
      // Function calls and component/class identifiers: Demo(), useTheme,
      // and capitalized identifiers Prism can't classify further (imported
      // component names used as plain values, e.g. `{ Group, Button }`).
      {
        types: [
          'function',
          'class-name',
          'tag-id',
          'selector',
          'atrule-id',
          'maybe-class-name'
        ],
        style: {
          color: func
        }
      },
      // Object/prop keys and member access: palette.success, { success: 1 }
      {
        types: ['property', 'property-access', 'literal-property'],
        style: {
          color: attrName
        }
      },
      // Plain identifiers and JSX text children (e.g. the "Gallery" in
      // <Button>Gallery</Button>): same as the rest of the prose, no tint.
      {
        types: ['variable', 'parameter', 'plain-text'],
        style: {
          color: theme.palette.foreground
        }
      },
      {
        types: ['deleted'],
        style: {
          textDecorationLine: 'line-through'
        }
      },
      {
        types: ['inserted'],
        style: {
          textDecorationLine: 'underline'
        }
      },
      {
        types: ['italic'],
        style: {
          fontStyle: 'italic'
        }
      },
      {
        types: ['important', 'bold'],
        style: {
          fontWeight: 'bold'
        }
      },
      {
        types: ['important'],
        style: {
          color: tag
        }
      }
    ]
  }
}

export default makeCodeTheme
