import Demo from '../components/Demo'

export default function HomePage() {
  return <Demo />
}

export const getConfig = async () => {
  return {
    render: 'static'
  } as const
}
