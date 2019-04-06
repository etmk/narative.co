import React, { Component, useContext } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Link, navigate } from 'gatsby'
import OutsideClickHandler from 'react-outside-click-handler'
import { isMobileOnly } from 'react-device-detect'

import { Section, Logo } from '@components'
import mediaqueries from '@styles/media'
import { ContactContext } from '@components/Contact/Contact.Context'

const navLinks = [
  { to: '/careers', text: 'Careers' },
  { to: '/labs', text: 'Labs' },
  { to: '/articles', text: 'Articles' },
  { to: '/contact', text: 'Contact' },
]

const animateIn = [
  { width: '15px', transform: 'initial' },
  {
    width: '20px',
    transform: 'translate3d(3px, -2px, 0) rotate(90deg)',
  },
  {
    width: '20px',
    transform: 'translate3d(3px, -2px, 0) rotate(90deg)',
  },
  {
    width: '20px',
    transform: 'translate3d(-3px, -2px, 0) rotate(90deg)',
  },
]

const animateOut = [
  {
    width: '20px',
    transform: 'translate3d(-3px, -2px, 0) rotate(90deg)',
  },
  { width: '15px', transform: 'initial' },
]

const themes = {
  light: {
    color: '#fff',
    pseudo: 'transparent',
  },
  dark: {
    color: '#000',
    pseudo: '#fafafa',
  },
}

interface NavigationState {
  active: boolean
  previousPath: string
  showPreviousPath: boolean
}

class Navigation extends Component<{}, NavigationState> {
  leftToggle = React.createRef()

  state = {
    active: false,
    previousPath: '',
    showPreviousPath: false,
  }

  componentDidMount() {
    const previousPath = localStorage.getItem('previousPath')
    this.setState({ previousPath })

    window.addEventListener('keydown', this.handleEscKeyPress)
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (typeof window !== 'undefined') {
      const previousPathFromStorage = localStorage.getItem('previousPath')
      const urlsThatUseBackButton = ['/articles/']

      if (prevState.previousPath !== previousPathFromStorage) {
        this.setState({
          previousPath: previousPathFromStorage,
          showPreviousPath: urlsThatUseBackButton.some(
            pathname => window.location.pathname.indexOf(pathname) >= 0
          ),
        })
      }
    }
    return null
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleEscKeyPress)
    }
  }

  handleEscKeyPress = ({ key }) => {
    if (key === 'Escape') {
      this.handleOutsideClick()
    }
  }

  handleToggleClick = () => {
    const $toggle = this.leftToggle.current

    this.setState(
      {
        active: !this.state.active,
      },
      () => {
        if (!isMobileOnly) {
          if (this.state.active && $toggle) {
            $toggle.animate(animateIn, {
              duration: 900,
              fill: 'both',
              easing: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
            })
          } else {
            this.handleCloseAnimation()
          }
        }
      }
    )
  }

  handleCloseAnimation = () => {
    const $toggle = this.leftToggle.current

    if ($toggle) {
      $toggle.animate(animateOut, {
        duration: 250,
        fill: 'both',
        easing: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
      })
    }
  }

  handleOutsideClick = () => {
    if (this.state.active) {
      this.handleCloseAnimation()
      this.setState({ active: false })
    }
  }

  navigateOut = (event, path) => {
    event.preventDefault()
    this.handleOutsideClick()

    if (path === '#') return

    setTimeout(() => {
      navigate(path)
    }, 250)
  }

  render() {
    const { active, previousPath, showPreviousPath } = this.state
    const { nav } = this.props
    const fill = nav.theme === 'dark' ? '#000' : '#fff'
    const theme = themes[nav.theme]

    return (
      <ThemeProvider theme={theme}>
        <OutsideClickHandler onOutsideClick={this.handleOutsideClick}>
          <NavFixedContainer navFixed={nav.fixed}>
            <Section>
              <NavContainer>
                {previousPath && showPreviousPath && (
                  <LogoBack onClick={() => window.history.back()}>
                    <BackChevron />
                  </LogoBack>
                )}
                <LogoMask>
                  <LogoContainer to="/" aria-label="Back home">
                    <Logo fill={fill} />
                  </LogoContainer>
                </LogoMask>
                <Right>
                  <ToggleContainer
                    onClick={this.handleToggleClick}
                    aria-label="Mobile Navigation Button"
                    air-expanded={active}
                    aria-haspopup="true"
                    aria-controls="menu-list"
                  >
                    <LeftToggle
                      active={active}
                      ref={this.leftToggle}
                      aria-hidden="true"
                    />
                    <RightToggle active={active} aria-hidden="true" />
                  </ToggleContainer>
                  <Nav>
                    <DesktopNavList id="menu-list">
                      <NavItems
                        active={active}
                        handleClick={this.navigateOut}
                        handleOutsideClick={this.handleOutsideClick}
                      />
                    </DesktopNavList>
                  </Nav>
                </Right>
              </NavContainer>
            </Section>
          </NavFixedContainer>
        </OutsideClickHandler>
      </ThemeProvider>
    )
  }
}

export default Navigation

const NavItems = ({ active, handleClick, handleOutsideClick }) => {
  const { toggleContact } = useContext(ContactContext)

  return navLinks.map((nav, index) => {
    const delay = active ? 30 * (navLinks.length - index) : 30 * index

    if (nav.to === '/contact') {
      return (
        <NavItem key={nav.to}>
          <NavAnchor
            active={active ? active : undefined}
            disabled={nav.disabled}
            to={nav.to}
            delay={delay}
            as={Link}
            tabindex={active ? 0 : -1}
            onClick={event => {
              event.preventDefault()
              toggleContact()
              handleOutsideClick()
            }}
            getProps={({ isPartiallyCurrent }) =>
              isPartiallyCurrent ? { ['data-active']: 'true' } : null
            }
          >
            {nav.text}
          </NavAnchor>
        </NavItem>
      )
    }

    return (
      <NavItem key={nav.to}>
        <NavAnchor
          active={active ? active : undefined}
          disabled={nav.disabled}
          to={nav.to}
          delay={delay}
          as={Link}
          tabindex={active ? 0 : -1}
          onClick={event => handleClick(event, nav.to)}
          getProps={({ isPartiallyCurrent }) =>
            isPartiallyCurrent ? { ['data-active']: 'true' } : null
          }
        >
          {nav.text}
        </NavAnchor>
      </NavItem>
    )
  })
}

const NavFixedContainer = styled.div`
  position: absolute;
  height: 90px;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;

  ${mediaqueries.tablet`
    position: ${p => (p.navFixed ? 'fixed' : 'absolute')};
  `}
`

const NavContainer = styled.div`
  position: relative;
  z-index: 100;
  padding-top: 100px;
  display: flex;
  justify-content: space-between;

  ${mediaqueries.tablet`
    padding-top: 50px;
  `};
`

const LogoBack = styled.button`
  position: absolute;
  left: -44px;
  top: 107px;

  svg {
    transition: transform 0.25s var(--ease-out-quad);
  }

  &:hover svg {
    transform: translateX(-4px);
  }

  ${mediaqueries.tablet`
    display: none;
  `}
`

const LogoContainer = styled(Link)`
  position: relative;
  transition: opacity 0.3s var(--ease-out-quad);
  max-width: 114px;

  &:hover {
    opacity: 0.6;
  }

  &:focus::after {
    content: '';
    position: absolute;
    left: -10%;
    top: -42%;
    width: 120%;
    height: 200%;
    border: 1px solid ${p => p.theme.colors.purple};
    background: rgba(255, 255, 255, 0.01);
    border-radius: 5px;
  }
`

const LogoMask = styled.div`
  display: inline-block;
  max-width: 114px;

  ${mediaqueries.tablet`
    overflow: hidden;
  `}
`

const ToggleContainer = styled.button`
  position: relative;
  height: 40px;
  width: 40px;
  right: -10px;
  cursor: pointer;

  &:focus::after {
    content: '';
    position: absolute;
    left: 0;
    top: 1px;
    width: 100%;
    height: 100%;
    border: 1px solid ${p => p.theme.colors.purple};
    background: rgba(255, 255, 255, 0.01);
    border-radius: 5px;
  }

  ${mediaqueries.phablet`
    width: 30px;
    height: 30px;
    right: -10px;
  `};
`

const Toggle = styled.span`
  position: absolute;
  right: 10px;
  height: 1px;
  background: ${p => p.theme.color};
  transition: transform 0.4s cubic-bezier(0.075, 0.82, 0.165, 1),
    width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  ${mediaqueries.tablet`
      display: none;
    `}
`

const LeftToggle = styled(Toggle)`
  top: 23px;
  width: ${p => (p.active ? '20px' : '15px')};

  ${mediaqueries.phablet`
    top: 15px;
    width: 15px;
  `};

  &::after {
    content: '';
    position: absolute;
    height: 1px;
    background: ${p => p.theme.pseudo};
    width: 100%;
    bottom: -1px;
    left: 0;
  }
`

const RightToggle = styled(Toggle)`
  top: 17px;
  width: 20px;
  transform: ${p =>
    p.active ? 'translate3d(3px, 4px, 0) rotate(90deg)' : 'initial'};

  ${mediaqueries.phablet`
    top: 9px;
    transform: initial;
  `};

  &::after {
    content: '';
    position: absolute;
    height: 1px;
    background: ${p => p.theme.pseudo};
    width: 100%;
    bottom: -1px;
    left: 0;
  }
`

const Nav = styled.nav``

const Right = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`

const DesktopNavList = styled.ul`
  list-style: none;

  ${mediaqueries.phablet`
  display: none;

  `};
`

const NavItem = styled.li`
  display: inline-block;
  margin-right: 60px;

  &:last-child {
    margin-right: 40px;
  }

  ${mediaqueries.tablet`
    margin-right: 40px;

    &:first-child {
      display: none;
    }

    &:last-child {
      margin-right: 30px;
    }
  `};

  ${mediaqueries.phablet`
    display: block;
    margin: 0 auto;

    &:first-child {
      display: block;
    }

    &:last-child {
      margin: 0 auto;
    }
  `};
`

const NavAnchor = styled.a`
  display: flex;
  height: 40px;
  align-items: center;
  color: ${p => p.theme.color};
  font-weight: 600;
  font-size: 18px;
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.9) ${p => p.delay}ms,
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.9) ${p => p.delay}ms;

  pointer-events: ${p => (p.active ? 'initial' : 'none')};
  opacity: ${p => (p.active ? (p.disabled ? 0.15 : 1) : 0)};
  transform: ${p => (p.active ? 'translateX(0)' : 'translateX(12px)')};

  &[data-active='true'] {
    &::after {
      content: '';
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
      bottom: 4px;
      height: 1px;
      width: 20px;
      background: ${p => p.theme.color};
    }
  }

  &:hover {
    opacity: ${p => (p.disabled ? 0.15 : 0.6)};
  }

  &:focus {
    outline: none;
  }

  &:focus::after {
    content: '';
    position: absolute;
    margin: 0 auto;
    left: 0;
    right: 0;
    bottom: 4px;
    height: 1px;
    width: 20px;
    background: ${p => p.theme.color};
  }

  ${mediaqueries.phablet`
    display: block;
    margin: 0 auto;
    text-align: center;
    color: #000;
    font-weight: 400;
    margin-bottom: 10px;

  transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.9) ${p =>
    p.delay + 300}ms,
    transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.9) ${p =>
      p.delay * 2 + 300}ms;
      opacity: ${p => (p.active ? (p.disabled ? 0.15 : 1) : 0)};
  transform: ${p => (p.active ? 'translateX(0)' : 'translateY(30px)')};
  `};
`

const BackChevron = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.41 16.09L10.83 11.5L15.41 6.91L14 5.5L8 11.5L14 17.5L15.41 16.09Z"
      fill="black"
    />
  </svg>
)
