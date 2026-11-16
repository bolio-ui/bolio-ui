import AppShell, {
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  AppShellAside,
  AppShellFooter
} from './AppShell'

export type AppShellComponentType = typeof AppShell & {
  Header: typeof AppShellHeader
  Navbar: typeof AppShellNavbar
  Main: typeof AppShellMain
  Aside: typeof AppShellAside
  Footer: typeof AppShellFooter
}
;(AppShell as AppShellComponentType).Header = AppShellHeader
;(AppShell as AppShellComponentType).Navbar = AppShellNavbar
;(AppShell as AppShellComponentType).Main = AppShellMain
;(AppShell as AppShellComponentType).Aside = AppShellAside
;(AppShell as AppShellComponentType).Footer = AppShellFooter

export type { AppShellProps } from './AppShell'
export default AppShell as AppShellComponentType
