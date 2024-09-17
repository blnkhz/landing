import "./contactForm.css";
import { useState, useEffect } from "react";

export const ContactForm = ({ isVisible, handleVisibility }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  useEffect(() => {
    if (name && email && validateEmail(email) && subject && message) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, email, subject, message]);

  const submitContactForm = async () => {
    const data = new FormData();
    data.append("entry.2016301740", name);
    data.append("entry.1127346973", email);
    data.append("entry.1922200865", subject);
    data.append("entry.711076141", message);
    const url =
      "https://docs.google.com/forms/d/e/1FAIpQLSdG2OcJ3Tpe0xMdHIk2nJp3GAaVGGGrERnjIAU7MUxbRfW7dw/formResponse";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: data,
        mode: "no-cors",
      });
      if (response.status >= 400) {
        console.error("Form submission failed");
      } else {
        console.log("Form submitted successfully");
        clearForm();
        setIsFormSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div
      className={`contact-form-container ${isVisible ? "visible" : "hidden"}`}
    >
      <div className="headline">
        <h1>say hi 👋</h1>
        <button
          onClick={() => {
            handleVisibility(!isVisible);
            setIsFormSubmitted(false);
          }}
          className="close-button"
        >
          X
        </button>
      </div>
      <form>
        <label htmlFor="name">name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        ></input>
        <label htmlFor="email">email</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></input>
        <label htmlFor="subject">subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          onChange={(e) => setSubject(e.target.value)}
          value={subject}
        ></input>
        <label htmlFor="message">message</label>
        <textarea
          id="message"
          name="message"
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          cols={33}
          value={message}
        ></textarea>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            submitContactForm();
          }}
          disabled={!isFormValid}
          className="submit-button"
        >
          {isFormSubmitted ? "message sent, thank you" : "send message"}
        </button>
      </form>
    </div>
  );
};
