import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { default as Link } from "next/link";
import { ReactComponent as Logo } from "../resources/icon.svg";
import { LOCAL_STORAGE_THEME } from "../constants/storage";

const toggleTheme = () => {
  const mode = localStorage.getItem(LOCAL_STORAGE_THEME) ?? "light";
  const newMode = mode === "light" ? "dark" : "light";
  localStorage.setItem(LOCAL_STORAGE_THEME, newMode);
  document.documentElement.setAttribute("data-theme", newMode);
};

export const AppHeader = () => {
  return (
    <>
      <header>
        <Link href="/" className="main-logo">
          <Logo />
          <h2>CHAIR FLIGHT</h2>
        </Link>
        <button className="secondary outline" onClick={toggleTheme}>
          <BsFillSunFill className="light-mode-only" />
          <BsFillMoonStarsFill className="dark-mode-only" />
        </button>
      </header>
      <div className="header-companion" />
      <style jsx>{`
        header {
          width: 100%;
          position: fixed;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--toolbar-height);
          padding: 0 1rem 0 2rem;
          background-color: var(--card-background-color);
          z-index: 1000;
          box-shadow: 
            rgb(0 0 0 / 20%) 0px 2px 1px -1px, 
            rgb(0 0 0 / 14%) 0px 1px 1px 0px, 
            rgb(0 0 0 / 12%) 0px 1px 3px 0px;
        }

        .header-companion {
          height: var(--toolbar-height);
          width: 100%;
          content: "";
        }

        header > :global(.main-logo) {
          display: flex;
          vertical-align: center;
          align-items: center;
          text-decoration: none;
        }

        header > :global(.main-logo > h2) {
          font-size: 14px;
          margin-left: 4px;
          margin-bottom: 0px;
          font-weight: 700;
          letter-spacing: 0.05rem;
          color: var(--h1-color);
        }

        header > :global(.main-logo > svg) {
          width: 25px;
          height: 25px;
        }

        header > :global(.main-logo > svg) {
          fill: var(--primary);
        }

        header:after {
          content: "alpha";
          position: absolute;
          width: 80px;
          height: 25px;
          background: #ffc107;
          top: 4px;
          left: -25px;
          z-index: 3000;
          text-align: center;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: bold;
          color: #fff;
          line-height: 27px;
          transform: rotate(-45deg);
        }

        button {
          border: none;
          margin: 0;
          flex: 0;
          padding: 0;
        }

        button:focus {
          box-shadow: none;
        }

        :global(:root:not([data-theme="dark"]) .light-mode-only) {
          display: none;
        }

        :global(:root:not([data-theme="light"]) .dark-mode-only) {
          display: none;
        }
      `}</style>
    </>
  );
};
