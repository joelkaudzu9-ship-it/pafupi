"use client";

import { useEffect, useState } from "react";

export default function PafupiSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let pageLoaded = document.readyState === "complete";
    let exitTimer: number | undefined;
    let removed = false;

    const finishSplash = () => {
      if (removed || exitTimer !== undefined) return;

      const elapsed = Date.now() - startTime;
      const minimumTimePassed = elapsed >= 2500;
      const maximumTimePassed = elapsed >= 8000;

      if ((!pageLoaded || !minimumTimePassed) && !maximumTimePassed) {
        return;
      }

      removed = true;
      setLeaving(true);

      exitTimer = window.setTimeout(() => {
        setVisible(false);
      }, 500);
    };

    const onPageLoad = () => {
      pageLoaded = true;
      finishSplash();
    };

    window.addEventListener("load", onPageLoad);

    const minimumTimer = window.setTimeout(finishSplash, 2500);
    const fallbackTimer = window.setTimeout(finishSplash, 8000);

    if (pageLoaded) {
      finishSplash();
    }

    return () => {
      window.removeEventListener("load", onPageLoad);
      window.clearTimeout(minimumTimer);
      window.clearTimeout(fallbackTimer);

      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`pafupi-splash ${leaving ? "pafupi-splash--leaving" : ""}`}
      role="status"
      aria-label="Loading PAFUPI"
    >
      <div className="pafupi-splash__content">
        <div className="pafupi-splash__mark">p.</div>
        <div className="pafupi-splash__wordmark">pafupi</div>
        <div className="pafupi-splash__tagline">
          SUPPORT IS CLOSER THAN YOU THINK
        </div>
        <div className="pafupi-splash__loader">
          <span className="loader" aria-hidden="true" />
        </div>
        <div className="pafupi-splash__message">
          A little closer. A little at a time.
        </div>
      </div>
    </div>
  );
}