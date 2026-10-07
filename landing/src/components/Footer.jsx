export default function Footer() {
  return (
    <footer className="wrap">
      <span>© {new Date().getFullYear()}</span>
      <span style={{ fontSize: '8px' }}>
        no cookies. visits are counted anonymously.
      </span>
      <a href="#top">back to generation zero ↑</a>
    </footer>
  )
}
