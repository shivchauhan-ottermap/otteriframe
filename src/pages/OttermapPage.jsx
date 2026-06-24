import { useEffect } from "react";
import OttermapPortal from "../components/ottermap/OttermapPortal";
import { useOttermapChallenge } from "../hooks/useOttermapChallenge";

export default function OttermapPage() {
  const challenge = useOttermapChallenge();

  useEffect(() => {
    document.title = "Ottermap — 72-Hour Technical Challenge";
  }, []);

  return <OttermapPortal {...challenge} />;
}
