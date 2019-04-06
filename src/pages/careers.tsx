import React from 'react'
import { graphql } from 'gatsby'

import Layout from '@components/Layout'
import SEO from '@components/SEO'

import CareersHero from '../sections/careers/Careers.Hero'
import CareersBody from '../sections/careers/Careers.Body'

function CareersPage({ data, location }) {
  const contentful = data.allContentfulPage.edges[0].node
  const pageBackground =
    'linear-gradient(rgb(9, 10, 12),rgb(17, 18, 22) 60%,#1a1e24 100%)'

  const navConfig = {
    offset: true,
    fixed: true,
    theme: 'light',
  }

  const footerConfig = {
    visible: true,
  }

  return (
    <Layout background={pageBackground} nav={navConfig} footer={footerConfig}>
      <SEO
        title={contentful.seo.title}
        description={contentful.seo.description}
        image={contentful.seo.image.file.url}
        pathname={location.pathname}
      />
      <CareersHero />
      <CareersBody />
    </Layout>
  )
}

export default CareersPage

export const pageQuery = graphql`
  query CareersPageQuery {
    allContentfulPage(filter: { pageName: { eq: "Careers" } }) {
      edges {
        node {
          seo {
            title
            description
            image {
              file {
                url
              }
            }
          }
        }
      }
    }
  }
`
