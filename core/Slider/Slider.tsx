import React, {
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import useTheme from '../use-theme'
import useDrag, { DraggingEvent } from '../utils/use-drag'
import useCurrentState from '../utils/use-current-state'
import SliderDot from './SliderDot'
import SliderMark from './SliderMark'
import { getColors } from './styles'
import { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

export type SliderTypes = NormalTypes
interface Props {
  hideValue?: boolean
  value?: number
  type?: SliderTypes
  initialValue?: number
  step?: number
  max?: number
  min?: number
  disabled?: boolean
  showMarkers?: boolean
  onChange?: (val: number) => void
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type SliderProps = Props & NativeAttrs

const getRefWidth = (elementRef: RefObject<HTMLElement | null> | null): number => {
  if (!elementRef || !elementRef.current) return 0
  const rect = elementRef.current.getBoundingClientRect()
  return rect.width || rect.right - rect.left
}

const getValue = (
  max: number,
  min: number,
  step: number,
  offsetX: number,
  railWidth: number
): number => {
  if (offsetX < 0) return min
  if (offsetX > railWidth) return max
  const widthForEachStep = (railWidth / (max - min)) * step
  if (widthForEachStep <= 0) return min

  const slideDistance = Math.round(offsetX / widthForEachStep) * step + min
  return Number.isInteger(slideDistance)
    ? slideDistance
    : Number.parseFloat(slideDistance.toFixed(1))
}

const SliderComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SliderProps>
>(
  (
    {
      hideValue = false,
      disabled = false,
      type = 'default' as SliderTypes,
      step = 1,
      max = 100,
      min = 0,
      initialValue = 0,
      value: customValue,
      onChange,
      className = '',
      showMarkers = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [value, setValue] = useState<number>(initialValue)
    const [, setSliderWidth, sideWidthRef] = useCurrentState<number>(0)
    const [, setLastDargOffset, lastDargOffsetRef] = useCurrentState<number>(0)
    const [isClick, setIsClick] = useState<boolean>(false)

    const sliderRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => sliderRef.current as HTMLDivElement)
    const dotRef = useRef<HTMLDivElement>(null)

    const currentRatio = useMemo(
      () => ((value - min) / (max - min)) * 100,
      [value, max, min]
    )

    const setLastOffsetManually = (val: number) => {
      const width = getRefWidth(sliderRef)
      const shouldOffset = ((val - min) / (max - min)) * width
      setLastDargOffset(shouldOffset)
    }

    const updateValue = useCallback(
      (offset: number) => {
        const currentValue = getValue(
          max,
          min,
          step,
          offset,
          sideWidthRef.current
        )
        setValue(currentValue)
        onChange && onChange(currentValue)
      },
      [max, min, step, sideWidthRef]
    )

    const { bg } = useMemo(
      () => getColors(theme.palette, type),
      [theme.palette, type]
    )

    const dragHandler = (event: DraggingEvent) => {
      if (disabled) return
      const currentOffset = event.currentX - event.startX
      const offset = currentOffset + lastDargOffsetRef.current
      updateValue(offset)
    }

    const dragStartHandler = () => {
      setIsClick(false)
      setSliderWidth(getRefWidth(sliderRef))
    }

    const dragEndHandler = (event: DraggingEvent) => {
      if (disabled) return
      const offset = event.currentX - event.startX
      const currentOffset = offset + lastDargOffsetRef.current
      const boundOffset =
        currentOffset < 0 ? 0 : Math.min(currentOffset, sideWidthRef.current)
      setLastDargOffset(boundOffset)
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return
      const nextByKey: Record<string, number> = {
        ArrowRight: value + step,
        ArrowUp: value + step,
        ArrowLeft: value - step,
        ArrowDown: value - step,
        PageUp: value + step * 10,
        PageDown: value - step * 10,
        Home: min,
        End: max
      }
      if (!(event.key in nextByKey)) return
      event.preventDefault()
      const next = Math.min(max, Math.max(min, nextByKey[event.key]))
      if (next === value) return
      setValue(next)
      setLastOffsetManually(next)
      onChange && onChange(next)
    }

    const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      if (!sliderRef || !sliderRef.current) return
      setIsClick(true)
      setSliderWidth(getRefWidth(sliderRef))
      const clickOffset =
        event.clientX - sliderRef.current.getBoundingClientRect().x
      setLastDargOffset(clickOffset)
      updateValue(clickOffset)
    }

    useDrag(dotRef, dragHandler, dragStartHandler, dragEndHandler)

    useEffect(() => {
      if (customValue === undefined) return
      if (customValue === value) return
      setValue(customValue)
    }, [customValue, value])

    useEffect(() => {
      initialValue && setLastOffsetManually(initialValue)
    }, [])

    return (
      <div
        className={useClasses('slider', className)}
        onClick={clickHandler}
        ref={sliderRef}
        {...props}
      >
        <SliderDot
          disabled={disabled}
          ref={dotRef}
          isClick={isClick}
          left={currentRatio}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled || undefined}
          onKeyDown={keyDownHandler}
        >
          {hideValue || value}
        </SliderDot>
        {showMarkers && <SliderMark max={max} min={min} step={step} />}
        <style jsx>{`
          .slider {
            border-radius: 50px;
            background-color: ${disabled ? theme.palette.accents_2 : bg};
            position: relative;
            cursor: ${disabled ? 'not-allow' : 'pointer'};
            --slider-font-size: ${SCALES.font(1)};
            width: ${SCALES.width(1, '100%')};
            height: ${SCALES.height(0.5)};
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
              ${SCALES.pl(0)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }
        `}</style>
      </div>
    )
  }
)

SliderComponent.displayName = 'BolioUISlider'
const Slider = withScale(SliderComponent)
export default Slider
