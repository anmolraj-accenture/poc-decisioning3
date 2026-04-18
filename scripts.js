function decodeHtmlEntities(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function renderOffer(result) {
  console.log("🔍 Web SDK decision response:", result);

  const container = document.getElementById("ajo-offer");
  if (!container) {
    console.error("❌ Container with id 'ajo-offer' not found.");
    return;
  }

  const proposition = result?.propositions?.[0];
  const item = proposition?.items?.[0];
  const html = item?.data?.content;

  if (html) {
    const decodedHtml = decodeHtmlEntities(html);
    console.log("✅ Personalized HTML received:", decodedHtml);
    container.innerHTML = decodedHtml;
  } else {
    console.warn("⚠️ No personalized offer returned.");
    container.innerHTML = "<p>No personalized offers available at this time.</p>";
  }
}

function runPersonalization() {
  console.log("🚀 Sending personalization request to AJO...");
alloy("sendEvent", {
  renderDecisions: true,
  personalization: {
    surfaces: ["web://anmolraj-accenture.github.io/poc-decisioning2#ajo-offer"],
  },
}).then(renderOffer)
    .catch((error) => {
      console.error("❌ sendEvent failed:", error);
      const errorBox = document.getElementById("error-message");
      if (errorBox) {
        errorBox.textContent = "Failed to load personalization.";
      }
    });  
}

function waitForAlloy(callback, retries = 30) {
  if (typeof alloy === "function") {
    console.log("✅ Alloy loaded.");
    callback();
  } else if (retries > 0) {
    console.log("⌛ Waiting for Alloy...");
    setTimeout(() => waitForAlloy(callback, retries - 1), 300);
  } else {
    console.error("❌ alloy is not loaded after waiting.");
    const errorBox = document.getElementById("error-message");
    if (errorBox) {
      errorBox.textContent = "Adobe Alloy did not load.";
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  waitForAlloy(runPersonalization);
});
