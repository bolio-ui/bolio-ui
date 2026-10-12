// Structured data for search engines. `<` is escaped so a value can never
// close the script tag.
const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c')
    }}
  />
)

export default JsonLd
