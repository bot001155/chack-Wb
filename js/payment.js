let selectedPlatform = "";
let redirectOrderId = "";

/* =========================
   CONFIG
========================= */
const BACKEND_URL = "https://delta-backend.onrender.com";

/* =========================
   SEND ORDER
========================= */
function sendOrder(platform) {
  const name = document.getElementById("name").value.trim();
  const product = document.getElementById("product").value.trim();
  const email = document.getElementById("email").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !product || !email) {
    alert("Please fill all details");
    return;
  }

  selectedPlatform = platform;

  /* AUTO ORDER ID */
  redirectOrderId =
    "DMS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  /* DATE & TIME */
  const dateTime = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  /* SHOW LOADER */
  document.getElementById("loading").style.display = "flex";

  /* SEND TO BACKEND */
  fetch(`${BACKEND_URL}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: redirectOrderId,
      data: {
        name,
        product,
        email,
        payment,
        platform,
        dateTime
      }
    })
  })
    .then(() => {
      setTimeout(() => {
        document.getElementById("loading").style.display = "none";

        document.getElementById("successSound").play();
        if (navigator.vibrate) navigator.vibrate(200);

        document.getElementById("popupOrderId").innerText =
          "Order ID: " + redirectOrderId;

        document.getElementById("popup").style.display = "flex";
      }, 800);
    })
    .catch(() => {
      document.getElementById("loading").style.display = "none";
      alert("Server error. Please try again.");
    });
}

/* =========================
   COPY ORDER ID
========================= */
function copyOrderId() {
  navigator.clipboard.writeText(redirectOrderId);
}

/* =========================
   CONFIRM REDIRECT
========================= */
function confirmRedirect() {
  /* TELEGRAM */
  if (selectedPlatform === "telegram") {
    const msg =
      "Hello, I placed an order.\nOrder ID: " + redirectOrderId;

    window.location.href =
      "tg://resolve?domain=Delta_Market_Owner&text=" +
      encodeURIComponent(msg);

    setTimeout(() => {
      window.location.href =
        "https://t.me/Delta_Market_Owner?text=" +
        encodeURIComponent(msg);
    }, 1000);
  }

  /* INSTAGRAM */
  if (selectedPlatform === "instagram") {
    document.getElementById("popup").style.display = "none";

    document.getElementById("instaOrderId").innerText =
      "🆔 Order ID: " + redirectOrderId;

    document.getElementById("instaPopup").style.display = "flex";
  }
}

/* =========================
   INSTAGRAM FINAL REDIRECT
========================= */
function goToInstagram() {
  const INSTAGRAM_USERNAME = "deltamarket015";

  navigator.clipboard.writeText(
    "Hello, I placed an order.\nOrder ID: " + redirectOrderId
  );

  window.location.href =
    "https://ig.me/m/" + INSTAGRAM_USERNAME;
}
