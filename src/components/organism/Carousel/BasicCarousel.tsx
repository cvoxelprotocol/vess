import styled from '@emotion/styled'
import { FC } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export const BasicCarousel: FC = () => {
  const CarouselContainer = styled.div`
    width: 100%;
    padding: 24px 16px;
    display: grid;
    place-content: center;
    place-items: center;

    @media (max-width: 599px) {
      padding: 16px 0px;
    }
  `

  const CarouselHolder = styled.div`
    width: 80%;

    @media (max-width: 1079px) {
      width: 80%;
    }
    @media (max-width: 599px) {
      width: 100%;
    }
  `

  const CarouselItemContainer = styled.div`
    object-fit: cover;
    object-position: center;
    border-radius: 40px;
    overflow: hidden;
    margin: 0px 8px;
    cursor: pointer;
    position: relative;
    z-index: 0;

    @media (max-width: 599px) {
      border-radius: 24px;
      margin: 0px 8px;
    }
  `

  const jumpToURL = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <CarouselContainer>
      <CarouselHolder>
        <Carousel
          autoPlay
          interval={3000}
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          swipeable
          emulateTouch
          width={'100%'}
          centerMode={false}
          centerSlidePercentage={80}
        >
          <CarouselItemContainer
            onClick={() =>
              jumpToURL('https://vesslabs23.substack.com/p/self-sovereign-resume-dapp-vess-resume')
            }
          >
            <img src='/carousel/carousel_item1.jpg' width={'100%'} />
          </CarouselItemContainer>
          <CarouselItemContainer onClick={() => jumpToURL('https://synapss.vess.id')}>
            <img src='/carousel/carousel_item2.jpg' width={'100%'} />
          </CarouselItemContainer>
        </Carousel>
      </CarouselHolder>
    </CarouselContainer>
  )
}
