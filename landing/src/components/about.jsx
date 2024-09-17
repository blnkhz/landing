import "./about.css";
import Spline from "@splinetool/react-spline";

export const About = ({ isVisible, handleVisibility }) => {
  return (
    <div className={`about-container ${isVisible ? "visible" : "hidden"}`}>
      <div className="about-content">
        <>
          <div className="headline">
            <h1>about</h1>
            <button
              className="close-button"
              onClick={() => handleVisibility(!isVisible)}
            >
              X
            </button>
          </div>
          <div className="section basics">
            <Spline
              scene="https://prod.spline.design/czUjKcIZGP4HQwGX/scene.splinecode"
              className="about-can"
            />
            <div>
              <p>blanka e hooz</p>
              <p>software engineer</p>
              <p>budapest, hungary ✈️ los angeles, ca</p>
              <a
                href="https://linkedin.com/in/blnkhz"
                target="_blank"
                className="link"
              >
                linkedin
              </a>
              {" | "}
              <a
                href="https://github.com/blnkhz"
                target="_blank"
                className="link"
              >
                github
              </a>
              {" | "}
              <a
                href="https://instagram.com/blnkhz"
                target="_blank"
                className="link"
              >
                instagram
              </a>
            </div>
          </div>
          <div className="headline">
            <h3>experience</h3>
            <span
              className="link"
              onClick={() =>
                window.open(
                  "https://raw.githubusercontent.com/blnkhz/landing/master/blanka_hooz_resume.pdf",
                  "_blank"
                )
              }
            >
              download cv
            </span>
          </div>
          <ul className="experience-list">
            <li>
              <div className="experience-entry">
                <h5>full stack engineer @ bobcats coding</h5>
                <p>july 2023 - present</p>
              </div>
              <ul className="workplace-list">
                <li>
                  key contributor to building a hospitality marketing app for a
                  startup client. Joined the project in its greenfield stage and
                  have helped develop it into a now live platform in Colorado,
                  connecting users with local bars and restaurants through POS
                  APIs and aggregating user data on our platform derived from
                  app usage.
                </li>
                <li>
                  developing scalable and efficient application features using
                  TypeScript, React, Qwik, tRPC, Koa, PostgreSQL and Google
                  Cloud
                </li>
                <li>
                  collaborating closely with our in-house UI/UX designer,
                  contributing via Figma to create intuitive user interfaces.
                  Participating in weekly stakeholder meetings to align on
                  project goals and updates.
                </li>
                <li>
                  providing on-call support during events to ensure seamless
                  user experience and immediate issue resolution.
                </li>
                <li>
                  implementing Behavior-Driven Development (BDD) and end-to-end
                  testing using Cucumber, Playwright, and Jest to ensure
                  high-quality deliverables.
                </li>
              </ul>
            </li>
            <li>
              <div className="experience-entry">
                <h5>full stack engineer @ ibm</h5>
                <p>sept 2019 - july 2023</p>
              </div>
              <ul className="workplace-list">
                <li>
                  contributed to both internal tools and client-facing
                  applications within the IBM Cloud microservice ecosystem over
                  a period of 3 years and 9 months at IBM Budapest Lab.
                </li>
                <li>
                  enhanced application accessibility (a11y) and implemented
                  internationalization (i18n) to make applications more
                  inclusive and globally adaptable.
                </li>
                <li>
                  increased unit test coverage to over 80% in certain
                  repositories during idle time, employing Jest and Cypress for
                  unit and end-to-end testing.
                </li>
                <li>
                  worked with teams across multiple locations, operating in
                  two-week sprints to deliver high-quality software.
                </li>
                <li>
                  participated in an on-call rotation to ensure service
                  reliability and prompt issue resolution for our services.
                </li>
                <li>
                  technologies Used: JavaScript, TypeScript, Node.js,
                  Express.js, IBM Cloud services, NoSQL (Cloudant), Travis CI,
                  Jest, Cypress
                </li>
              </ul>
            </li>
            <li>
              <div className="experience-entry">
                <h5>software developer mentor @ green fox academy</h5>
                <p>october 2018 - sept 2019</p>
              </div>
              <ul className="workplace-list">
                <li>
                  mentored bootcamp students from zero to landing their first
                  developer job
                </li>
                <li>
                  contributed to teaching materials used in various parts of the
                  course
                </li>
                <li>
                  technologies used & mentored: js, ts, java, html, css, sql,
                  nosql, react, express, node.js
                </li>
              </ul>
            </li>
          </ul>
        </>
        <div className="headline">
          <h3>education</h3>
        </div>
        <ul className="experience-list">
          <li>
            <div className="experience-entry">
              <h5>
                junior software developer @ green fox academy, budapest, hungary
              </h5>
              <p>2018</p>
            </div>
          </li>
          <li>
            <div className="experience-entry">
              <h5>
                business administration BA @ middlesex university, london, uk
              </h5>
              <p>2014-2018</p>
            </div>
          </li>
          <li>
            <div className="experience-entry">
              <h5>business administration BA @ university of pécs, hungary</h5>
              <p>2014-2018</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
