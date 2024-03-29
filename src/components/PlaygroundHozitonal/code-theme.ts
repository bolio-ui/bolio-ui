import { PrismTheme } from 'prism-react-renderer'
import { BolioUIThemes } from 'core/Themes/Presets'

const makeCodeTheme = (theme: BolioUIThemes): PrismTheme => ({
  plain: {
    backgroundColor: theme.palette.pre,
    color: '#FFF',
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: theme.font.mono,
    fontSize: '.875rem',
    textRendering: 'geometricPrecision',
    borderBottomLeftRadius: theme.layout.radius,
    borderBottomRightRadius: theme.layout.radius
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: 'theme.palette.accents_3',
        opacity: 0.5
      }
    },
    {
      types: ['punctuation'],
      style: {
        color: '#fff'
      }
    },
    {
      types: ['namespace'],
      style: {
        opacity: 1
      }
    },
    {
      types: ['tag', 'operator', 'number'],
      style: {
        color: theme.palette.warningLighter
      }
    },
    {
      types: ['property', 'function'],
      style: {
        color: theme.palette.primary
      }
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: '#eeebff'
      }
    },
    {
      types: ['attr-name'],
      style: {
        color: theme.palette.warning
      }
    },
    {
      types: [
        'boolean',
        'string',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
        'placeholder',
        'variable'
      ],
      style: {
        color: theme.palette.secondaryLighter
      }
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through'
      }
    },
    {
      types: ['language-javascript', 'script'],
      style: {
        color: theme.palette.primary
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
        color: '#c4b9fe'
      }
    }
  ]
})

export default makeCodeTheme
