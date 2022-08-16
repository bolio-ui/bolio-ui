import { GetStaticProps, GetStaticPaths } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import * as Components from 'core'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Docs from 'src/templates/Docs'

const components = {
  ...Components,
  SyntaxHighlighter
}

interface Props {
  frontMatter: string
  mdxSource: MDXRemoteSerializeResult
}

function GuidePage({ mdxSource }: Props) {
  return (
    <Docs>
      {mdxSource && <MDXRemote {...mdxSource} components={components} />}
    </Docs>
  )
}

const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync(path.join('src/content/guide'))

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.mdx', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params || {}

  const markdownWithMeta = fs.readFileSync(
    path.join('src/content/guide', slug + '.mdx'),
    'utf-8'
  )

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        require('remark-autolink-headings'),
        require('remark-slug')
      ],
      rehypePlugins: [require('@mapbox/rehype-prism')]
    }
  })

  return {
    props: {
      frontMatter,
      slug,
      mdxSource
    }
  }
}

export { getStaticProps, getStaticPaths }
export default GuidePage
