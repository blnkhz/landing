import { jobs, links } from '../content'

export default function Experience() {
  return (
    <section className="work wrap" id="work">
      <div className="work-head">
        <div>
          <p className="eyebrow">experience</p>
          <h2>
            Seven years,
            <br />
            four places
          </h2>
        </div>
        <p>
          A big cloud, a few startups, and a year teaching people to code. Details are in the{' '}
          <a href={links.resume} target="_blank" rel="noopener">
            résumé (pdf) ↗
          </a>
        </p>
      </div>
      <ol className="jobs" reversed>
        {jobs.map((job) => (
          <li className="job" key={job.company}>
            <p className="when">
              {job.when}
              {job.current && (
                <>
                  <br />
                  <span className="now">current</span>
                </>
              )}
            </p>
            <div className="job-body">
              <h3>
                {job.href ? (
                  <a href={job.href} target="_blank" rel="noopener">
                    {job.company} <small>↗</small>
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              <p className="role">{job.role}</p>
              <ul>
                <li>{job.summary}</li>
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
