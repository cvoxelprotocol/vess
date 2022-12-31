import { useEffect } from 'react'
import { NavRail } from '@/components/molecule/NavRail/NavRail'
import { useThemeMode } from '@/hooks/useThemeMode'

export default function Home() {
  const { setDarkMode } = useThemeMode()

  useEffect(() => {
    setDarkMode()
  }, [])

  return (
    <main>
      <NavRail />
    </main>
  )
}
