export default function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener">
      {children}
    </a>
  )
}
