import styled from '@emotion/styled'
import { FC } from 'react'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { NoItem } from '@/components/atom/Common/NoItem'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
  editable?: boolean
  onClick?: () => void
  EditButtonPosition?: string
}

export const SelfClaimedRoleWidget: FC<Props> = (props) => {
  const { businessProfile, isFetchingBusinessProfile } = useBusinessProfile(props.did)
  const { currentTheme, currentTypo } = useVESSTheme()
  const { openModal } = useVESSWidgetModal()

  const handleEdit = () => {
    openModal()
  }
  const Container = styled.div`
    padding: 16px;
  `

  return (
    <BaseWidget onClickEdit={handleEdit} {...props}>
      <Container>
        <Flex alignItems={'center'} justifyContent={'flex-start'} height={'100%'} colGap={'8px'}>
          {isFetchingBusinessProfile ? (
            <CommonSpinner />
          ) : (
            <>
              {!businessProfile?.tags || businessProfile?.tags.length === 0 ? (
                <NoItem
                  text='set your tags...'
                  color={currentTheme.outline}
                  font={currentTypo.title.small}
                />
              ) : (
                <>
                  {businessProfile?.tags &&
                    businessProfile.tags.map((role) => {
                      return (
                        <Chip
                          key={role}
                          text={role}
                          variant={'filled'}
                          mainColor={currentTheme.primary}
                          textColor={currentTheme.onPrimary}
                        />
                      )
                    })}
                </>
              )}
            </>
          )}
        </Flex>
      </Container>
    </BaseWidget>
  )
}
