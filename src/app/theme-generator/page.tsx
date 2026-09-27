import type { Metadata } from 'next'
import ThemeGeneratorTemplate from 'src/templates/ThemeGenerator'

export const metadata: Metadata = {
  title: { absolute: 'Theme Generator - Bolio UI' },
  description:
    'Pick your primary and secondary colors and get a ready to use Bolio UI theme, previewed live on real components in light and dark.'
}

export default function Page() {
  return <ThemeGeneratorTemplate />
}
