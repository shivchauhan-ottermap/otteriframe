import { useEffect } from "react";
import TrraPortal from "../components/trra/TrraPortal";

export default function TrraPage() {
  useEffect(() => {
    document.title = "Velocity Zone Manager — Round 2 Technical Task · Ottermap × TerraSync";
    document.body.classList.add("trra-active");
    return () => document.body.classList.remove("trra-active");
  }, []);

  return <TrraPortal />;
}
