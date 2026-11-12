import type { Metadata } from 'next'
import ThemesTemplate from 'src/templates/Themes'

export const metadata: Metadata = {
  title: { absolute: 'Theme Builder - Bolio UI' },
  description:
    'Choose a color and a radius and see Bolio UI components composed into real screens, in light and dark.'
}

export default function Page() {
  return <ThemesTemplate />
}
