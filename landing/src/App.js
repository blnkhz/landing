import { ContactForm } from "./components/contactForm";
import "./App.css";
import { useState } from "react";
import { SplineCanvas } from "./components/scene";
import { About } from "./components/about";

const App = () => {
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  return (
    <div className="main-content">
      <button
        onClick={() => setIsContactFormVisible(!isContactFormVisible)}
        className="styled-button contact"
        hidden={isContactFormVisible || isAboutVisible}
      >
        say hi
      </button>
      <button
        onClick={() => setIsAboutVisible(!isAboutVisible)}
        className="styled-button about"
        hidden={isAboutVisible || isContactFormVisible}
      >
        about:blank<span className="tiny">a</span>
      </button>
      <SplineCanvas />
      <ContactForm
        isVisible={isContactFormVisible}
        handleVisibility={setIsContactFormVisible}
      />
      <About isVisible={isAboutVisible} handleVisibility={setIsAboutVisible} />
    </div>
  );
};

export default App;
