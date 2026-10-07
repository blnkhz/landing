import { Fragment } from 'react'
import { about } from '../content'

export default function About() {
  return (
    <section className="about wrap" id="about">
      <div>
        <p className="eyebrow">about</p>
        <h2>{about.heading}</h2>
      </div>
      <div className="copy">
        <p className="lede">{about.lede}</p>
        <p>{about.body}</p>
        <dl className="facts">
          {about.facts.map(([term, value]) => (
            <Fragment key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </section>
  )
}
