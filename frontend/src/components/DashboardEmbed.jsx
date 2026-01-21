import React, { useEffect, useRef, useState } from "react";
import * as powerbi from "powerbi-client";
import axios from "axios";

const DashboardEmbed = () => {
  const containerRef = useRef();
  const [embedToken, setEmbedToken] = useState(null);

  useEffect(() => {
    axios.get("/api/powerbi/token")  // backend renvoie l'embed token
      .then(res => setEmbedToken(res.data.embedToken))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!embedToken) return;

    const embedConfig = {
      type: "report",
      id: "TON_REPORT_ID",
      embedUrl: "TON_EMBED_URL",
      accessToken: embedToken,
      tokenType: powerbi.models.TokenType.Embed,
      settings: { filterPaneEnabled: false, navContentPaneEnabled: true },
    };

    const report = powerbi.embed(containerRef.current, embedConfig);

    // Polling simple pour refresh auto
    const interval = setInterval(async () => {
      try {
        const res = await axios.post("/api/dashboard/refresh");
        if (res.data.message === "Trigger refresh côté frontend") {
          report.refresh();
          console.log("🔄 Dashboard Power BI rafraîchi !");
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [embedToken]);

  return <div ref={containerRef} style={{ width: "100%", height: "900px" }} />;
};

export default DashboardEmbed;
