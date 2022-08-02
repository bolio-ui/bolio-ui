import * as S from './styles'

const Main = ({
  title = 'Bolio UI',
  description = 'Make your development more creative and dynamic with amazing tools for React. 🥷🏼'
}) => (
  <S.Wrapper>
    <S.Title>{title}</S.Title>
    <S.Description>{description}</S.Description>
  </S.Wrapper>
)

export default Main
