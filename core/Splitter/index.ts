import Splitter from './Splitter'
import SplitterPanel from './SplitterPanel'

export type SplitterComponentType = typeof Splitter & {
  Panel: typeof SplitterPanel
}
;(Splitter as SplitterComponentType).Panel = SplitterPanel

export type { SplitterProps, SplitterDirection } from './Splitter'
export type { SplitterPanelProps } from './SplitterPanel'
export default Splitter as SplitterComponentType
