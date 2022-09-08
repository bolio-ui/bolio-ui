import { Action } from 'kbar'
import { NextRouter, useRouter } from 'next/router'
import { useSettings } from 'src/utils/use-settings'
// import { Route } from '@lib/docs/page'
import { getId } from 'core/utils/collections'
import { removeFromLast } from 'src/utils/remove-from-last'
// data imported from manifest
import docsManifest from 'src/pages/docs/manifest.json'

const docsActions: Action[] = []

export interface Route {
  title: string
  subtitle?: string
  section?: string
  heading?: boolean
  keywords?: string
  icon?: string
  open?: boolean
  path?: string
  routes?: Route[]
  updated?: boolean
  newPost?: boolean
  comingSoon?: boolean
}

const buildDocsActions = (
  router: NextRouter,
  routes: Route[],
  parent?: string
) => {
  routes.forEach((route: Route) => {
    const routeId = getId()
    const routePath: unknown = route.path
      ? removeFromLast(route.path, '.')
      : null
    const action: Action = {
      id: routeId,
      name: route.title,
      section: route.section || '',
      parent: parent,
      shortcut: [],
      children: [],
      keywords: route.keywords || '',
      subtitle: route.subtitle || ''
    }
    if (routePath) {
      action.perform = () => {
        router.push(routePath)
      }
    }
    if (route.icon) {
      action.icon = route.icon
    }
    if (parent) {
      docsActions
        .filter((act) => act.id === parent)
        .map((act) => {
          return act.children?.push(routeId)
        })
    }
    docsActions.push(action)
    if (route.routes) {
      buildDocsActions(router, route.routes, routeId)
    }
  })
}

const handleExternalLink = (href: string) => {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    rel: 'noopener noreferrer',
    href
  }).click()
}

const useActions = (): Action[] => {
  const router = useRouter()
  const settings = useSettings()

  const routes = docsManifest.routes
  buildDocsActions(router, routes)

  const staticActions: Action[] = [
    {
      id: 'github',
      name: 'Github',
      subtitle: 'bolio-ui',
      section: 'Social',
      shortcut: [],
      keywords: 'github, source code, open, code',
      icon: 'Github',
      perform: () => handleExternalLink('https://github.com/bolio-ui/bolio-ui/')
    },
    {
      id: 'twitter',
      name: 'Twitter',
      subtitle: '@bolio_ui',
      section: 'Social',
      shortcut: [],
      keywords: 'dm, twitter, contact',
      icon: 'Twitter',
      perform: () => handleExternalLink('https://twitter.com/bolio_ui/')
    },
    {
      id: 'instagram',
      name: 'Instagram',
      subtitle: '@bolio.ui',
      section: 'Social',
      shortcut: [],
      keywords: 'dm, instagram, contact',
      icon: 'Instagram',
      perform: () => handleExternalLink('https://instagram.com/bolio.ui/')
    },
    {
      id: 'changeTheme',
      name: 'Change Theme',
      section: 'General',
      shortcut: [],
      keywords:
        'background, change color, color, change theme, theme, dark, light',
      icon: 'Target',
      children: ['darkTheme', 'lightTheme']
    },
    {
      id: 'darkTheme',
      name: 'Dark',
      parent: 'changeTheme',
      keywords: 'dark',
      icon: 'Moon',
      shortcut: [],
      perform: () => settings.switchTheme('dark')
    },
    {
      id: 'lightTheme',
      name: 'Light',
      parent: 'changeTheme',
      keywords: 'light',
      shortcut: [],
      icon: 'Sun',
      perform: () => settings.switchTheme('light')
    }
  ]

  return [...docsActions, ...staticActions]
}

export default useActions
