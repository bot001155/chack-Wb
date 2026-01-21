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

  /* SHOW LOADER */
  document.getElementById("loading").style.display = "flex";

  /* SEND TO BACKEND (✅ MATCHES server.js) */
  fetch(`${BACKEND_URL}/send-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      orderId: redirectOrderId,
      name: name,
      product: product,
      plan: "Standard",              // you can make this dynamic later
      price: document.getElementById("priceDisplay")?.innerText || "",
      payment: payment,
      platform: platform,
      email: email
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loading").style.display = "none";

      if (!data.success) {
        alert("Order failed. Please try again.");
        return;
      }

      document.getElementById("successSound").play();
      if (navigator.vibrate) navigator.vibrate(200);

      document.getElementById("popupOrderId").innerText =
        "Order ID: " + redirectOrderId;

      document.getElementById("popup").style.display = "flex";
    })
    .catch(err => {
      console.error(err);
      document.getElementById("loading").style.display = "none";
      alert("Server error. Please try again later.");
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
