import React, { Component } from 'react'
import styled from 'styled-components'
import throttle from 'lodash/throttle'

import { clamp } from '@utils'

export interface IProgress {
  height: number
  offset: number
  onClose?: () => void
}

class Progress extends Component<
  IProgress,
  { value: number; headings: []; hasHinted: boolean }
> {
  ticking = false

  state = { value: 0, headings: [], hasHinted: false }

  componentDidMount() {
    this.handleProgressHeadings()

    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onScroll)
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll)
      window.removeEventListener('resize', this.onScroll)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.offset !== this.props.offset ||
      prevProps.height !== this.props.height
    ) {
      this.handleProgressHeadings()
    }

    if (this.state.hasHinted === false && this.state.value > 8) {
      this.setState({ hasHinted: true })
    }
  }

  handleProgressHeadings = () => {
    const { height } = this.props
    const allHeadings = Array.from(document.querySelectorAll('h2')).reverse()

    const headings = allHeadings
      .map(heading => {
        const offsetTop = heading.offsetTop
        const text = heading.innerText
        const headingOffset = (offsetTop / height) * 100

        return {
          text,
          offset: offsetTop,
          offetPercentage: headingOffset,
        }
      })
      .reverse()

    const introduciton = {
      text: '',
      offetPercentage: 0,
    }

    this.setState({ headings: [introduciton, ...headings] })
  }

  onScroll = throttle((event: Event) => {
    if (!this.ticking) {
      // RAF and make our progress calculation
      // on callback of the setState clear the thread
      window.requestAnimationFrame(() => {
        const percentComplete =
          ((window.scrollY - this.props.offset) /
            (this.props.height - this.props.offset)) *
          100

        this.setState(
          { value: clamp(+percentComplete.toFixed(2), -2, 104) },
          () => (this.ticking = false)
        )
      })
      // Prevent further scrolls triggers
      this.ticking = true
    }
  })

  render = () => {
    const { value, headings, hasHinted } = this.state

    return (
      <Frame tabIndex={-1} value={value} hasHinted={hasHinted}>
        <Introduction onClick={() => scrollTo(0, 0)}>
          <Arrow /> <IntoHeading>Introduction</IntoHeading>
        </Introduction>
        <ProgressBar>
          {headings.map((heading, index) => {
            const previousOffset = headings[index - 1]
              ? headings[index - 1].offetPercentage
              : 0
            const nextOffset = headings[index + 1]
              ? headings[index + 1].offetPercentage
              : 100

            const start = value - heading.offetPercentage
            const multiplier = 100 / (nextOffset - heading.offetPercentage)

            const individualOFfset = {
              transform: `translateY(${start - 100}%)`,
              height: 100 * multiplier + '%',
            }

            return (
              <Frame key={heading.text}>
                <Chapter
                  value={value}
                  offset={heading.offetPercentage}
                  previousOffset={previousOffset}
                  nextOffset={nextOffset}
                  onClick={() =>
                    scrollTo(0, heading.offset + this.props.offset)
                  }
                >
                  <ChapterProgress style={individualOFfset} />
                </Chapter>
                <HeadingHover>
                  <Heading
                    value={value}
                    offset={heading.offetPercentage}
                    previousOffset={previousOffset}
                    nextOffset={nextOffset}
                    onClick={() =>
                      scrollTo(0, heading.offset + this.props.offset)
                    }
                  >
                    {heading.text}
                  </Heading>
                </HeadingHover>
              </Frame>
            )
          })}
        </ProgressBar>
      </Frame>
    )
  }
}

export default Progress

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 1px;
  height: calc(88vh - 40px);
  max-height: 520px;
  outline: none;
  user-select: none;
`

const HeadingHover = styled.div`
  opacity: 0;
  transition: opacity 0.3s linear;
`

const Introduction = styled.div`
  position: absolute;
  top: -30px;
  left: -5px;
  opacity: 0;
  transition: opacity 0.3s linear;

  svg path {
    fill: ${p => p.theme.mode.text};
  }
`

const IntoHeading = styled.h6`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  padding-left: 22px;
  top: 8px;
  bottom: 0;
  width: 180px;
  font-weight: 400;
  color: ${p => p.theme.mode.text};
  opacity: 0.25;

  &:hover {
    opacity: 0.5;
  }
`

const Frame = styled.div`
  position: relative;
  flex: 1;
  padding-bottom: 5px;
  outline: none;
  user-select: none;

  &:hover ${HeadingHover}, &:hover ${Introduction} {
    opacity: 1;
  }

  ${p =>
    p.value < 4 &&
    !p.hasHinted &&
    `
    ${HeadingHover} {
      opacity: 1;
    }
  `}
`

const Chapter = styled.div`
  position: relative;
  height: 100%;
  margin-bottom: 5px;
  background-color: ${p => p.theme.mode.progress.bg};
  overflow: hidden;
`

const ChapterProgress = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${p => p.theme.mode.text};
  top: 0;
`

const Heading = styled.h6`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  padding-left: 18px;
  top: 0;
  bottom: 0;
  width: 180px;
  color: ${p => p.theme.mode.text};
  opacity: ${p =>
    p.value > p.previousOffset && p.value > p.offset && p.value < p.nextOffset
      ? '1 !important'
      : 0.25};
  font-weight: 400;
  transition: opacity 0.3s;

  &:hover,
  &:focus {
    opacity: 0.5;
  }
`

const Arrow = () => (
  <svg
    width="11"
    height="22"
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.85355 0.646445C4.65829 0.451183 4.34171 0.451183 4.14645 0.646445L0.964467 3.82843C0.769204 4.02369 0.769204 4.34027 0.964467 4.53553C1.15973 4.73079 1.47631 4.73079 1.67157 4.53553L4.5 1.70711L7.32843 4.53553C7.52369 4.7308 7.84027 4.7308 8.03553 4.53553C8.2308 4.34027 8.2308 4.02369 8.03553 3.82843L4.85355 0.646445ZM5 16L5 0.999999L4 0.999999L4 16L5 16Z" />
  </svg>
)
