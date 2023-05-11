import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { LinearProgress } from "@mui/joy";

export const AppTransition = () => {
  const router = useRouter();
  const oldRoute = useRef<string>(router.asPath);
  const [visible, setVisible] = useState(false);
  oldRoute.current = router.asPath;

  useEffect(() => {
    const onStart = (e: string) => {
      if (e.split("?")[0] === oldRoute.current.split("?")[0]) return;
      setVisible(true);
    };

    const onEnd = () => setVisible(false);

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onEnd);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onEnd);
    };
  }, [router.events]);

  return (
    <LinearProgress
      sx={{
        "--LinearProgress-radius": 0,
        transition: `bottom ${visible ? "0.2s" : "0.7s"} ease`,
        position: "fixed",
        bottom: visible ? 0 : -6,
        left: "-5%",
        width: "110%",
        zIndex: 1000,
      }}
    />
  );
};
