// The element type that React's attribute types (HTMLAttributes<T>, ...) take
// only types `event.currentTarget` in handlers. A component's props may go to
// any element, and `any` is what lets a consumer's handler use whichever
// element it expects, so it stays `any`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyElement = any

// An object with any values: what a consumer's row, props or theme may be
// (an interface would not fit Record<string, unknown>).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends AnyObject ? DeepPartial<T[P]> : T[P]
}
