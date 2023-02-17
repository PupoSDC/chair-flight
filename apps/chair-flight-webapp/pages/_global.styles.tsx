export const CustomGlobalStyles = () => (
  <style jsx global>{`
    :root {
      --toolbar-height: 40px;
      --special-background: #96c7f2;
    }

    :root:not([data-theme="light"]) {
      --special-background: #003366;
    }

    html,
    body,
    #__next {
      display: block;
      padding: 0;
      margin: 0;
      height: 100%;
    }

    body {
      overflow-x: hidden;
    }

    .full-width {
      width: 100%;
    }
  `}</style>
);
