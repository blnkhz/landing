import { hobbies, hobbiesNote, toolkit } from '../content'

export default function Toolkit() {
  return (
    <section className="kit wrap" id="kit">
      <div>
        <h2>Toolkit</h2>
        <div className="kit-groups">
          {toolkit.map(([group, items]) => (
            <div className="kit-group" key={group}>
              <p className="eyebrow">{group}</p>
              <ul className="hobbies">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>Off hours</h2>
        <ul className="hobbies">
          {hobbies.map(({ label, href }) => (
            <li key={label}>
              {href ? (
                <a href={href} target="_blank" rel="noopener">
                  {label}
                </a>
              ) : (
                label
              )}
            </li>
          ))}
        </ul>
        <p className="note">{hobbiesNote}</p>
      </div>
    </section>
  )
}
