import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import useUncontrolled from '../use-uncontrolled'
import styles from './NavLink.module.css'

interface Props {
  label: React.ReactNode
  description?: React.ReactNode
  // before the label
  icon?: React.ReactNode
  // after the label, such as a badge, in place of the arrow of a parent
  rightSection?: React.ReactNode
  // the page the user is on
  active?: boolean
  disabled?: boolean
  // makes the item a link. A parent, which has children, is always a button.
  href?: string
  // for a parent: open items, to control them
  opened?: boolean
  defaultOpened?: boolean
  onOpenedChange?: (opened: boolean) => void
  className?: string
}

type NativeAttrs = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof Props | 'children'
>
export type NavLinkProps = Props & NativeAttrs & { children?: React.ReactNode }

const NavLinkComponent = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  NavLinkProps
>(
  (
    {
      label,
      description,
      icon,
      rightSection,
      active = false,
      disabled = false,
      href,
      opened: customOpened,
      defaultOpened = false,
      onOpenedChange,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [opened, setOpened] = useUncontrolled<boolean>({
      value: customOpened,
      defaultValue: defaultOpened,
      onChange: onOpenedChange
    })
    const parent = React.Children.count(children) > 0

    const rootStyle = {
      '--nav-link-font-size': SCALES.font(0.875),
      '--nav-link-width': SCALES.width(1, '100%'),
      '--nav-link-color': theme.palette.foreground,
      '--nav-link-muted': theme.palette.accents_5,
      '--nav-link-radius': theme.layout.radius,
      '--nav-link-hover-bg': theme.palette.accents_2,
      '--nav-link-active-color': theme.palette.primary,
      '--nav-link-active-bg': `color-mix(in srgb, ${theme.palette.primary} 12%, transparent)`,
      '--nav-link-focus': theme.palette.primary,
      '--nav-link-disabled': theme.palette.accents_3,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    const content = (
      <>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.body}>
          <span className={styles.label}>{label}</span>
          {description && (
            <span className={styles.description}>{description}</span>
          )}
        </span>
        {rightSection ? (
          <span className={styles.right}>{rightSection}</span>
        ) : (
          parent && (
            <svg
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={joinClasses(styles.chevron, {
                [styles.open]: opened
              })}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          )
        )}
      </>
    )

    const classes = joinClasses(styles.item, {
      [styles.active]: active,
      [styles.disabled]: disabled
    })

    return (
      <div className={useClasses(styles.root, className)} style={rootStyle}>
        {href && !parent ? (
          <a
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={disabled ? undefined : href}
            aria-current={active ? 'page' : undefined}
            aria-disabled={disabled || undefined}
            className={classes}
          >
            {content}
          </a>
        ) : (
          <button
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            ref={ref as React.Ref<HTMLButtonElement>}
            type="button"
            disabled={disabled}
            aria-current={active && !parent ? 'page' : undefined}
            aria-expanded={parent ? opened : undefined}
            className={classes}
            onClick={(event) => {
              props.onClick?.(event as never)
              if (parent) setOpened(!opened)
            }}
          >
            {content}
          </button>
        )}
        {parent && opened && <div className={styles.children}>{children}</div>}
      </div>
    )
  }
)

NavLinkComponent.displayName = 'BolioUINavLink'
const NavLink = withScale(NavLinkComponent)
export default NavLink
