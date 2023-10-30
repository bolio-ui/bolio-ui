import Input from './Input'
import Textarea from '../Textarea'
import InputPassword from './Password'

export type InputComponentType = typeof Input & {
  Textarea: typeof Textarea
  Password: typeof InputPassword
}
;(Input as InputComponentType).Textarea = Textarea
;(Input as InputComponentType).Password = InputPassword

export type { InputProps } from './Input'
export type { InputTypes } from './InputProps'
export type { InputPasswordProps } from './Password'
export type { TextareaProps } from '../Textarea'
export default Input as InputComponentType
