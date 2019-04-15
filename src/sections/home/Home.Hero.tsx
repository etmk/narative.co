import React, { useState, useEffect, useContext } from 'react'
import { Link, navigate } from 'gatsby'
import styled from 'styled-components'

import { ButtonArrow, Section, Heading } from '@components'
import ScrollIndicator from '@components/ScrollIndicator'
import ShapeShifter from '@components/ShapeShifter'
import IntersectionObserver from '@components/IntersectionObserver'
import LayoutHeroMobile from '@components/Layout/Layout.Hero.Mobile'
import { ContactContext } from '@components/Contact/Contact.Context'

import mediaqueries from '@styles/media'
import { startAnimation } from '@utils'

function HomeHero() {
  // Fade in the text as we do on all the headings
  const [animation, setAnimation] = useState('')
  const { toggleContact } = useContext(ContactContext)

  useEffect(() => {
    startAnimation(() => {
      setAnimation('start')
    })
  }, [])

  const navigateOut = (event, path) => {
    event.preventDefault()
    setAnimation('')

    setTimeout(() => {
      navigate(path)
    }, 350)
  }

  return (
    <LayoutHeroMobile>
      <HomeHeroContainer id="home-hero">
        <Section>
          <IntersectionObserver
            render={({ intersectionRatio: ir }) => (
              <ContentContainer
                style={{ opacity: ir * ir }}
                animation={animation}
              >
                <TextContainer>
                  <Heading.h1>
                    Narative builds brands, websites and products for
                    growth-minded companies.
                  </Heading.h1>
                  <MainText>
                    We're a team with senior startup experience here to help
                    your business take the next step.
                  </MainText>
                  <ButtonArrow onClick={toggleContact} text="Get in touch" />
                </TextContainer>
                <ShapeShifter />
              </ContentContainer>
            )}
          />
          <ScrollIndicator />
        </Section>
      </HomeHeroContainer>
    </LayoutHeroMobile>
  )
}

export default HomeHero

const HomeHeroContainer = styled.div`
  ${mediaqueries.desktop`
    #mirror-mask {
      display: none;
  `}
`

const TextContainer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 570px;
  top: 10px;

  ${mediaqueries.phablet`
    position: relative;
  `}
`

const MainText = styled.p`
  font-size: 3.2rem;
  font-weight: 400;
  color: ${p => p.theme.colors.grey};
  line-height: 1.3;
  margin-bottom: 50px;

  ${mediaqueries.phablet`
    font-size: 2.2rem;
  `};
`

const ContentContainer = styled.div`
  height: calc(100vh - 230px);
  min-height: 600px;
  padding-top: 10px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  opacity: ${p => (p.animation ? 1 : 0)};
  transition: opacity 1.2s ease-out;

  ${mediaqueries.phablet`
    height: calc(100vh - 180px);
    min-height: 100%;
    padding: 0;
    top: -40px;
  `};

  @media screen and (max-height: 648px) {
    top: -60px;
  }

  ${mediaqueries.desktop_medium`
    min-height: 360px;
  `};
`
