import { Control, FieldValues, useWatch, Path } from 'react-hook-form'
import { MembershipCard } from '../Profile/MembershipCard'

type Props<T extends FieldValues> = {
  control: Control<T>
  watchName: Path<T>
  watchMembershipName: Path<T>
  watchMainColor?: Path<T>
  watchSecondColor?: Path<T>
  watchTextColor?: Path<T>
  icon?: string
  actionTitle?: string
  action?: () => void
  mainColor?: string
  textColor?: string
  roles?: string[]
}
export const MembershipCardWithWatch = <T extends FieldValues>({
  control,
  watchName,
  watchMainColor,
  watchSecondColor,
  watchTextColor,
  watchMembershipName,
  ...props
}: Props<T>) => {
  const workspaceName = useWatch({
    control,
    name: watchName,
  })
  const membershipName = useWatch({
    control,
    name: watchMembershipName,
  })
  return (
    <MembershipCard
      title={workspaceName || 'Project Name'}
      roles={[membershipName || 'Role']}
      {...props}
    />
  )
}
