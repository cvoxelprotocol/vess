import { useStateVESSLoadingModal } from '@/jotai/ui'

export const useVESSLoading = () => {
  const [isLoading, setLoading] = useStateVESSLoadingModal()

  return {
    isLoading,
    showLoading: () => setLoading(true),
    closeLoading: () => setLoading(false),
  }
}
