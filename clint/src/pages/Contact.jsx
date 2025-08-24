// src/Contact.jsx
import React from "react";
import "../styles/main.scss";
import Header from "../components/header1";
import Footer from "../components/Footer";
import { useForm, ValidationError } from "@formspree/react";

const persons = [
  {
    img: "/imgs/2.png",
    name: "ch.Akram",
    email: "akram0011@gmail.com",
    phone: "+92-897-9758697",
  },
  {
    img: "/imgs/1.png",
    name: "ch.Akram",
    email: "akram0011@gmail.com",
    phone: "+92-897-9758697",
  },
];

// 👇 Contact Form Component
function ContactForm() {
  const [state, handleSubmit] = useForm("xjkodpdk"); // 👈 اپنے form ID لگائیں

  if (state.succeeded) {
    return (
      <p style={{ color: "green" }}>
        ✅ Thanks for contacting us! We’ll reply soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" name="email" required />
      <ValidationError prefix="Email" field="email" errors={state.errors} />

      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" required />
      <ValidationError prefix="Message" field="message" errors={state.errors} />

      <button type="submit" disabled={state.submitting}>
        {state.submitting ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}

export default function Contact() {
  return (
    <>
      <Header />
      <main className="ali fade-in-page">
        {/* Banner Section */}
        <section className="baner" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
          <div className="cointain">
            <div className="contents" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
              <h1>#Let's Talk</h1>
              <p>read all cases studies about our products</p>
            </div>
          </div>
        </section>

        {/* Maps Section */}
        <section className="maps" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
          <div className="cointain">
            <div className="flexbox" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
              <div className="left-1" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
                <div className="jeadingss">
                  <h6>get in touch</h6>
                  <h3>visit our location or contact us today</h3>
                </div>
                <ul>
                  <li>
                    <samp>whatsapps : +92-347-8708641</samp>
                  </li>
                  <li>
                    <samp>phone : &nbsp; &nbsp; +92-347-8708641</samp>
                  </li>
                  <li>
                    <samp>email : &nbsp; &nbsp; talhaakram@gmail.com</samp>
                  </li>
                  <li>
                    <samp>address : &nbsp; moosa burten stor.</samp>
                  </li>
                </ul>
              </div>
              <div className="right_1" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d840.6491221113338!2d73.4837908!3d32.5636128!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f7d994bd0a67d%3A0x6ceac251e5d0e9db!2sHF7M%2BCJP%2C%20Wasu%20Rd%2C%20Wasu%20Village%2C%20Mandi%20Bahauddin!5e0!3m2!1sen!2s!4v1752395175543!5m2!1sen!2s"
                  width="600"
                  height="380"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form + Persons Section */}
        <section className="footer-botom" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
          <div className="cointain">
          
              <div className="form" data-aos="fade-up" data-aos-delay="380" data-aos-once="true">
                <div className="head">
                  <p>leave a message</p>
                  <h1>we love to hear from you</h1>
                </div>
                {/* 👇 Formspree ContactForm */}
                <ContactForm />
              </div>

             
            
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
