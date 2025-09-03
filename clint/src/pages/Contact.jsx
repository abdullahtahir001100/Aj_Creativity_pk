import react from "react";
import Header from "../components/header";
import Footer from "../components/Footer";
import { useEffect } from "react";
export default function ProductDetail() {
  return (
    <>
      <Header />
      <section>
        <div className="cointain">
          <div className="heading">
            <h1>Contact Us</h1>
          </div>
          <div className="main-contents">
            <div className="flexbox">
              <div className="form">
                <div className="heading-1">
                  <h4>Send Us A Message</h4>
                  <p>do you have a questions? a complaint? or need any help to use the right product from jave's handmade feel free to contect us.</p>
                </div>
                <div className="main-form">
                  <form action="">
                    <div className="flex">
                      <div className="input-box">
                        <label htmlFor="first name"></label>
                        <input type="text" placeholder="enter your first name" />
                      </div>
                      <div className="input-box">
                        <label htmlFor="last name"></label>
                        <input type="email" placeholder="enter your last name" />
                      </div>
                    </div>
                    <div className="flex">
                      <div className="input-box">
                        <label htmlFor="email"></label>
                        <input type="text" placeholder="enter your email" />
                      </div>
                      <div className="input-box">
                        <label htmlFor="contect details"></label>
                        <input name="" id="" placeholder="enter your phone namber"></input>
                      </div>
                    </div>
                    <div className="text-center">
                      <label htmlFor="message"></label>
                      <textarea name="" id=""></textarea>
                    </div>
                    <div className="btn">
                      <button type="submit">send a message</button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="blocks">
                <div className="head">
                  <h5>
                    hi! we are always here to help you .
                  </h5>
                  <div className="block">
                    <div className="flex">
                      <div className="icon">
                        <img src="" alt="" />
                      </div>
                      <h6>Phone</h6>
                      <p>035877787879879</p>
                    </div>
                  </div>
                  <div className="block">
                    <div className="flex">
                      <div className="icon">
                        <img src="" alt="" />
                      </div>
                      <h6>Phone</h6>
                      <p>035877787879879</p>
                    </div>
                  </div>
                  <div className="block">
                    <div className="flex">
                      <div className="icon">
                        <img src="" alt="" />
                      </div>
                      <h6>Phone</h6>
                      <p>035877787879879</p>
                    </div>
                  </div>
                  <div className="hr"></div>
                  <div className="head">
                    <h5>contect with us</h5>
                  </div>
                  <div className="social-icons">
                    <div className="ic-1"><img src="" alt="" /></div>
                    <div className="ic-1"><img src="" alt="" /></div>
                    <div className="ic-1"><img src="" alt="" /></div>
                    <div className="ic-1"><img src="" alt="" /></div>
                    <div className="ic-1"><img src="" alt="" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}