import react from "react";
import Header from "../components/header1";
import Footer from "../components/Footer";
import { useEffect } from "react";
export default function ProductDetail() {
  return (
    <>
      <Header />
      <section className="contact">
        <div className="cointain">
          <div className="headings">
            <h1>Contact Us</h1>
          </div>
          <div className="main-contents">

            <div className="form">
              <div className="heading-1">
                <h4>Send Us A Message</h4>
                <p>do you have a questions? a complaint? or need any help to use the right product from jave's handmade feel free to contect us.</p>
              </div>
              <div className="flexbox">
                <div className="main-form">
                  <form action="">
                    <div className="flex">
                      <div className="input-box">
                        <div className="lable">
                          <label htmlFor="first name">first name</label>
                        </div>
                        <input type="text" placeholder="enter your first name" />
                      </div>
                      <div className="input-box">
                        <div className="lable">
                          <label htmlFor="last name">last name</label>
                        </div>
                        <input type="email" placeholder="enter your last name" />
                      </div>
                    </div>
                    <div className="flex">
                      <div className="input-box">
                        <div className="lable">
                          <label htmlFor="email">email</label>
                        </div>
                        <input type="text" placeholder="enter your email" />
                      </div>
                      <div className="input-box">
                        <div className="lable">
                           <label htmlFor="contect details">contect details</label>
                        </div> 
                        <input name="" id="" placeholder="enter your phone namber"></input>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="lable">
                        <label htmlFor="message">message</label>
                      </div>
                      {/* <div className="lable">
                        <label htmlFor="message">message</label>
                      </div> */}
                      <textarea name="" id="" placeholder="Send a Message "></textarea>
                    </div>
                    <div className="btn">
                      <button type="submit">send a message</button>
                    </div>
                  </form>

                </div>
                <div className="blocks">
                  <div className="head">
                    <h5>
                      hi! we are always here to help you .
                    </h5>
                    <div className="block">
                      <div className="flex">
                        <div className="icon">
                          <img src="./email.png" alt="" />
                        </div>
                       
                         <div className="text">
                         <h6>Phone</h6>
                        <p>035877787879879</p>
                       </div>
                      </div>
                    </div>
                    <div className="block">
                      <div className="flex">
                        <div className="icon">
                          <img src=".\telephone.png" alt="" />
                        </div>
                        <div className="text">
                         <h6>Phone</h6>
                        <p>035877787879879</p>
                       </div>
                      </div>
                    </div>
                    <div className="block">
                      <div className="flex">
                        <div className="icon">
                          <img src="./mail.png" alt="" />
                        </div>
                        <div className="text">
                         <h6>Phone</h6>
                        <p>035877787879879</p>
                       </div>
                      </div>
                    </div>
                    <div className="hr"></div>
                    <div className="head">
                      <h5>contect with us</h5>
                    </div>
                    <div className="social-icons">
                      <div className="ic"><div className="ic-1"><img src="./1.png" alt="" /></div></div>
                      <div className="ic"><div className="ic-1"><img src="./4.png" alt="" /></div></div>
                      <div className="ic"><div className="ic-1"><img src="./3.png" alt="" /></div></div>
                      <div className="ic"><div className="ic-1"><img src="./2.png" alt="" /></div></div>
                     <div className="ic"><div className="ic-1"><img src="./mail.png" alt="" /></div></div>
                    </div>
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