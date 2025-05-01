import Footer from "../footer/Footer";
import "./AboutUs.scss";

export default function AboutUs() {
  return (
    <>
      <div className="about-us">
        <header className="hero">
          <h1>About Us</h1>
          <p>
            Discover our story and passion for delivering the best products to
            you.
          </p>
        </header>
        <section className="content">
          <div className="section">
            <h2>Our Mission</h2>
            <p>
              We aim to provide top-quality sports gear and accessories with a
              seamless shopping experience. Whether you're a professional
              athlete or a casual enthusiast, we’ve got you covered.
            </p>
          </div>
          <div className="section">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Curated selection of premium products</li>
              <li>Fast and reliable shipping</li>
              <li>Customer-first approach</li>
            </ul>
          </div>
          <div className="section team">
            <h2>Our Team</h2>
            <p>
              A dedicated group of professionals working to bring you the best
              in e-commerce innovation.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
