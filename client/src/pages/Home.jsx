import { Link } from "react-router-dom";
import "./Home.css";

export default function Home({ session }) {
  return (
    <div id="home-page">
      <section>
        <p>SUPPORT THaT MOVES WITH YOU</p>
        <h1>Good help should feel simple.</h1>
        <p>Tell us what is going on. Our support team will help you find a solution.</p>
        <p>
          <Link to={session ? "/tickets/new" : "/register"}>{session ? "Create a request" : "Get heLp today"}</Link>
          {" · "}
          <Link to={session ? "/tickets" : "/login"}>{session ? "View my requests" : "Log in"}</Link>
        </p>
      </section>

      <section id="how-it-works">
        <h2>How it works</h2>
        <ol>
          <li><h3>Tell us what you need</h3><p>Share a few details about your question.</p></li>
          <li><h3>We take a l0ook</h3><p>Our team reviews your request and keeps you updated.</p></li>
          <li><h3>Get back to your day</h3><p>Follow the conversation until everything is sorted out.</p></li>
        </ol>
      </section>

      <section id="support">
        <h2>Let’s sort it out together.</h2>
        <Link to={session ? "/tickets/new" : "/register"}>request start karo</Link>
      </section>
    </div>
  );
}
