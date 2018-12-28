import React, { Component } from 'react'
import Link from 'gatsby-link'
import styled, { keyframes } from 'styled-components'
import { Formik, Form as FormikForm, Field } from 'formik'

import {
  Button,
  ButtonArrow,
  Container,
  Heading,
  Form,
  SocialLinks,
} from '@components'
import { media } from '@styles'
import { apiCall, startAnimation } from '@utils'
import { SubmittedCheckIcon } from '../../icons/ui'

const validate = values => {
  let errors = {}

  if (!values.name) {
    errors.name = 'Required'
  }

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.details) {
    errors.details = 'Required'
  }
  if (values.details.length > 289) {
    errors.details = 'Short and sweet, please!'
  }

  return errors
}

class ContactForm extends Component {
  state = {
    animation: '',
    submitted: false,
    firstName: '',
  }

  componentDidMount() {
    startAnimation(() => {
      this.setState({
        animation: 'start',
      })
    })
  }

  handleSubmit = async (values, { setSubmitting }) => {
    const { name, email, details } = values

    const method = 'post'
    const endpoint = '/contact/proposal'
    const data = {
      email,
      details,
      name,
    }

    try {
      await apiCall({ method, endpoint, data })

      setSubmitting(false)
      this.setState({ submitted: true, firstName: name.split(' ')[0] })
    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    const { animation, firstName, submitted } = this.state

    return (
      <Container>
        {submitted ? (
          <SubmittedScreen>
            <SubmittedCheckIcon />
            <SubmittedHeader>Thank you, {firstName}</SubmittedHeader>
            <SubmittedText>
              Our business development team will get back to you shortly.
            </SubmittedText>
            <SubmittedBackButton to="/">Go back</SubmittedBackButton>
            <SocialLinksContainer>
              <SocialLinks fill="black" />
            </SocialLinksContainer>
            <CopyRightContainer>
              © {new Date().getFullYear()} Narative Studio Inc.
            </CopyRightContainer>
          </SubmittedScreen>
        ) : (
          <Formik
            onSubmit={this.handleSubmit}
            validate={validate}
            initialValues={{
              name: '',
              email: '',
              details: '',
            }}
            render={props => {
              return (
                <StyledFormikForm>
                  <FormSection
                    animation={animation}
                    delay={1350}
                    spacing="large"
                  >
                    <FormHeader morePadding>Tell us about you</FormHeader>
                    <span>
                      <Field
                        component={Form.Text}
                        label="your name"
                        name="name"
                      />
                      <Field
                        component={Form.Text}
                        label="email address"
                        name="email"
                      />
                    </span>
                  </FormSection>
                  <FormSection animation={animation} delay={1450}>
                    <FormHeader>Tell us about your idea</FormHeader>
                    <Field
                      component={Form.Textarea}
                      label="give us a short description"
                      name="details"
                      rows={4}
                    />
                  </FormSection>
                  <ButtonContainer animation={animation} delay={1550}>
                    <ButtonArrow
                      isSubmitting={props.isSubmitting}
                      color="black"
                      text="Submit"
                      type="submit"
                    />
                  </ButtonContainer>
                  <MobileButtonContainer>
                    <Button isSubmitting={props.isSubmitting} text="Submit" />
                    <MobileCopyRightContainer>
                      © {new Date().getFullYear()} Narative Studio Inc.
                    </MobileCopyRightContainer>
                  </MobileButtonContainer>
                </StyledFormikForm>
              )
            }}
          />
        )}
      </Container>
    )
  }
}

export default ContactForm

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const FormHeader = styled(Heading.h2)`
  color: #000;
  width: 265px;
  padding-right: ${p => (p.morePadding ? '100px' : '76px')};

  ${media.tablet`
    width: 100%;
    padding: 0;
    margin-bottom: 10px;
    color: ${p => p.theme.colors.grey};
  `};
`

const FormSection = styled.div`
  display: flex;
  margin-bottom: ${p => (p.spacing === 'large' ? '6rem' : '2.5rem')};

  ${media.tablet`
    margin-bottom: ${p => (p.spacing === 'large' ? '2rem' : '1rem')};
    flex-direction: column;
  `};

  transition: opacity 0.5s linear ${p => p.delay}ms,
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.9) ${p => p.delay}ms;
  opacity: ${p => (p.animation ? 1 : 0)};
  transform: ${p => (p.animation ? 'translateY(0)' : 'translateY(20px)')};
`

const StyledFormikForm = styled(FormikForm)`
  align-self: flex-end;
  position: relative;
  padding-bottom: 10rem;
  margin: 0 auto;

  ${media.hdpi`
    margin-left: 0;
    width: 100%;
    padding: 0 4rem 5rem;
  `};

  ${media.desktop`
    margin: 0 auto;
    padding: 0 0 5rem;
  `};

  ${media.phablet`
    width: 100%;
  `};
`

const SubmittedScreen = styled.div`
  width: 46rem;
  padding-bottom: 10rem;
  margin: 0 auto;
  align-self: flex-end;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  opacity: 0;
  animation: ${fadeIn} 50ms 500ms ${p => p.theme.transitions.in} forwards;

  ${media.mdpi`
    padding-bottom: 0;
    margin: 0 auto;
  `};

  svg {
    margin-bottom: 3rem;
  }
`

const SubmittedHeader = styled(Heading.h2)`
  margin-bottom: 3rem;
  color: #000;
`

const SubmittedText = styled.p`
  color: ${p => p.theme.colors.grey};
  font-size: 2.2rem;
  max-width: 275px;
  margin-bottom: 3rem;
`

const SubmittedBackButton = styled(Link)`
  font-size: 18px;
  font-weight: 600;
`

const SocialLinksContainer = styled.div`
  width: 100%;
  max-width: 240px;
  display: flex;
  margin: 100px auto 50px;
  justify-content: space-between;
`

const CopyRightContainer = styled.div`
  font-size: 16px;
  color: ${p => p.theme.colors.grey};
`

const MobileCopyRightContainer = styled.div`
  font-size: 16px;
  color: ${p => p.theme.colors.grey};
  text-align: center;
  margin: 45px auto 25px;
`

const ButtonContainer = styled.div`
  margin-left: 265px;
  padding-bottom: 50px;
  transition: opacity 0.5s linear ${p => p.delay}ms,
    transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.9) ${p => p.delay}ms;
  opacity: ${p => (p.animation ? 1 : 0)};
  transform: ${p => (p.animation ? 'translateY(0)' : 'translateY(20px)')};

  ${media.tablet`
    display: none;
  `};
`

const MobileButtonContainer = styled.div`
  display: none;

  ${media.tablet`
    display: block;
  `};
`
