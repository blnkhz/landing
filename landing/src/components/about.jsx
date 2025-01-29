import "./about.css";
import Spline from "@splinetool/react-spline";
import { useState } from "react";

const experiences = [
  {
    company: "Bars.com via Bobcats Coding",
    period: "july 2023 - present",
    role: "full stack engineer",
    projects: [
      {
        name: "Bars.com app",
        details: [
          "responsive, cross-platform web app",
          "React + Qwik + tRPC + Koa + PostgreSQL + Google Cloud",
          "contributed to POS system integration to provide promotional drinks for guests in participating venues",
          "collaborated on building text message provider for user verification and marketing purposes",
        ],
        image: "/bars-guest-app.png",
      },
      {
        name: "Bars.com admin dashboard",
        details: [
          "admin dashboard for Bars.com clients for promotion management and data analytics",
          "React + Qwik + tRPC + Koa + PostgreSQL + Google Cloud",
          "maintained and contributed to Storybook documentation",
          "created reusable data visualization chart components from scratch",
          "contributed to data aggregation for user analytics",
        ],
        image: "/bars-admin-dashboard.png",
      },
      {
        name: "Bars.com website",
        details: ["marketing website for Bars.com"],
        image: "/bars-landing.png",
      },
    ],
  },
  {
    company: "IBM Cloud",
    period: "sept 2019 - july 2023",
    role: "full stack engineer",
    projects: [
      {
        name: "IBM Cloud Status & Notifications",
        details: [
          "React + Node.js",
          "client-facing application that provides real-time updates on the status of IBM Cloud services",
          "built front-end features and contributed to back-end by aggregating events by location and service type",
          "covered contributions with unit, integration and e2e tests",
        ],
        image: "/ibm-status.png",
      },
      {
        name: "IBM Cloud Onboarding",
        details: [
          "React TS + GraphQL + Node.js",
          "web application that helps clients get started with selling their offerings on IBM Cloud",
          "maintained and supported legacy software in an on-call schedule that served as the predecessor of this product",
          "covered contributions with unit, integration and e2e tests",
        ],
        image: "/ibm-onboarding.png",
      },
      {
        name: "Other",
        details: [
          "Cloud PAL: IBM Cloud's internal UI library. Contributed to the development of reusable UI components, ensuring consistency, accessibility and efficiency across various frontend microservices. Maintained and updated the corresponding Storybook documentation",
          "full stack engineer on internal fraud & cybersecurity tools",
        ],
      },
    ],
  },
  {
    company: "Green Fox Academy",
    period: "october 2018 - sept 2019",
    role: "software developer mentor",
    projects: [
      {
        name: "Bootcamp Mentorship",
        details: [
          "mentored students in Hungary's very first software development bootcamp from zero to landing their first job in the industry",
          "contributed to teaching materials used in various parts of the course",
          "technologies used & mentored: js, ts, java, html, css, sql, nosql, react, express, node.js",
        ],
      },
    ],
  },
];

export const About = ({ isVisible, handleVisibility }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const handleMouseEnter = (id) => {
    setTimeout(() => setActiveTooltip(id), 50);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setActiveTooltip(null), 50);
  };
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
              <p>los angeles, ca</p>
              <a
                href="https://linkedin.com/in/blnkhz"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                linkedin
              </a>
              {" | "}
              <a
                href="https://instagram.com/blnkhz"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                instagram
              </a>
            </div>
          </div>
          <div className="headline">
            <h3>projects</h3>
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
        </>
        <section>
          <ul className="experience-list">
            {experiences.map((workplace, workplaceIndex) => (
              <li key={workplaceIndex}>
                <div className="experience-entry">
                  <h5>
                    {workplace.role} @ {workplace.company}
                  </h5>
                  <p>{workplace.period}</p>
                </div>
                {workplace.projects.map((project, projectIndex) => (
                  <div key={projectIndex} className="project-container">
                    <h6
                      className="project-title"
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        handleMouseEnter(`${workplaceIndex}-${projectIndex}`);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        handleMouseLeave();
                      }}
                    >
                      {project.name}
                    </h6>
                    <ul className="workplace-list">
                      {project.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                    {activeTooltip === `${workplaceIndex}-${projectIndex}` &&
                      project.image && (
                        <div className="tooltip-overlay">
                          <img src={project.image} alt={project.name} />
                        </div>
                      )}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
