import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import { clamp, hexToHsv, hsvToHex, normalizeHex } from './color-utils'
import type { Hsv } from './color-utils'
import styles from './ColorPicker.module.css'

interface Props {
  // "#rrggbb", or "#rgb"
  value?: string
  initialValue?: string
  // called with "#rrggbb" in lowercase
  onChange?: (hex: string) => void
  // colors to pick with one click
  swatches?: Array<string>
  // the text field for the hex code
  hexInput?: boolean
  disabled?: boolean
  panelLabel?: string
  hueLabel?: string
  hexLabel?: string
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'defaultValue'
>
export type ColorPickerProps = Props & NativeAttrs

const percent = (value: number) => Math.round(value * 100)

const ColorPickerComponent = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value,
      initialValue = '#000000',
      onChange,
      swatches,
      hexInput = true,
      disabled = false,
      panelLabel = 'Saturation and brightness',
      hueLabel = 'Hue',
      hexLabel = 'Hex color',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const isControlled = value !== undefined
    const [selfHex, setSelfHex] = useState(
      normalizeHex(initialValue) || '#000000'
    )
    const hex = (isControlled ? normalizeHex(value) : selfHex) || '#000000'

    // The color is kept as hue, saturation and brightness: a hex code forgets
    // the hue of a gray, so the thumb would jump while dragging along an edge.
    const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(hex))
    // a hex code that did not come from this picker takes over
    if (hsvToHex(hsv) !== hex) setHsv(hexToHsv(hex))

    const [text, setText] = useState(hex)
    useEffect(() => setText(hex), [hex])

    const panel = useRef<HTMLDivElement>(null)

    const update = (next: Hsv) => {
      setHsv(next)
      const nextHex = hsvToHex(next)
      if (nextHex === hex) return
      if (!isControlled) setSelfHex(nextHex)
      if (onChange) onChange(nextHex)
    }

    const pick = (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = panel.current?.getBoundingClientRect()
      if (!rect || !rect.width || !rect.height) return
      update({
        h: hsv.h,
        s: clamp((event.clientX - rect.left) / rect.width),
        v: 1 - clamp((event.clientY - rect.top) / rect.height)
      })
    }

    const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return
      event.currentTarget.setPointerCapture?.(event.pointerId)
      pick(event)
    }

    const pointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) pick(event)
    }

    // arrows move the saturation and the brightness, Shift in bigger steps
    const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 0.1 : 0.01
      const moves: Record<string, Partial<Hsv>> = {
        ArrowLeft: { s: clamp(hsv.s - step) },
        ArrowRight: { s: clamp(hsv.s + step) },
        ArrowUp: { v: clamp(hsv.v + step) },
        ArrowDown: { v: clamp(hsv.v - step) }
      }
      if (disabled || !moves[event.key]) return
      event.preventDefault()
      update({ ...hsv, ...moves[event.key] })
    }

    // A short code like "#abc" waits for the field to lose the focus, or it
    // would be rewritten as "#aabbcc" while a longer one is being typed.
    const textChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value)
      if (/^#?[0-9a-f]{6}$/i.test(event.target.value.trim())) {
        update(hexToHsv(event.target.value))
      }
    }

    const textBlur = () => {
      const typed = normalizeHex(text)
      if (typed) update(hexToHsv(typed))
      // the field shows the color the picker has, which a parent may refuse
      setText(hex)
    }

    const pickerStyle = {
      width: SCALES.width(1, '15em'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      fontSize: SCALES.font(0.875),
      '--picker-border': theme.palette.border,
      '--picker-radius': theme.layout.radius,
      '--picker-color': theme.palette.foreground,
      '--picker-bg': theme.palette.background,
      '--picker-focus': theme.palette.primary,
      '--picker-hover-border': theme.palette.accents_4,
      '--picker-swatch-ring': theme.palette.foreground,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        role="group"
        aria-disabled={disabled || undefined}
        className={useClasses(styles.picker, className, {
          [styles.disabled]: disabled
        })}
        {...props}
        style={pickerStyle}
      >
        <div
          ref={panel}
          className={styles.panel}
          style={{
            backgroundColor: hsvToHex({ h: hsv.h, s: 1, v: 1 })
          }}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
        >
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={panelLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent(hsv.s)}
            aria-valuetext={`${percent(hsv.s)}% saturation, ${percent(hsv.v)}% brightness`}
            aria-disabled={disabled || undefined}
            className={styles.thumb}
            style={{
              left: `${hsv.s * 100}%`,
              top: `${(1 - hsv.v) * 100}%`,
              backgroundColor: hex
            }}
            onKeyDown={keyDown}
          />
        </div>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={Math.round(hsv.h)}
          disabled={disabled}
          aria-label={hueLabel}
          className={styles.hue}
          onChange={(event) =>
            update({ ...hsv, h: Number(event.target.value) })
          }
        />
        {hexInput && (
          <div className={styles.field}>
            <span
              className={styles.preview}
              style={{ backgroundColor: hex }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={text}
              disabled={disabled}
              spellCheck={false}
              autoComplete="off"
              aria-label={hexLabel}
              className={styles.hex}
              onChange={textChange}
              onBlur={textBlur}
            />
          </div>
        )}
        {swatches && swatches.length > 0 && (
          <div className={styles.swatches}>
            {swatches.map((swatch) => {
              const color = normalizeHex(swatch)
              if (!color) return null
              return (
                <button
                  key={color}
                  type="button"
                  disabled={disabled}
                  aria-label={color}
                  aria-pressed={color === hex}
                  className={joinClasses(styles.swatch, {
                    [styles.active]: color === hex
                  })}
                  style={{ backgroundColor: color }}
                  onClick={() => update(hexToHsv(color))}
                />
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

ColorPickerComponent.displayName = 'BolioUIColorPicker'
const ColorPicker = withScale(ColorPickerComponent)
export default ColorPicker
