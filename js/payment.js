/* =========================
   GLOBAL STATE
========================= */
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
  try {
    const name = document.getElementById("name").value.trim();
    const product = document.getElementById("product").value.trim();
    const email = document.getElementById("email").value.trim();
    const payment = document.getElementById("payment").value;

    if (!name || !product || !email) {
      alert("Please fill all details");
      return;
    }

    selectedPlatform = platform;

    redirectOrderId =
      "DMS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const loading = document.getElementById("loading");
    loading.style.display = "flex";

    fetch(`${BACKEND_URL}/send-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: redirectOrderId,
        name: name,
        product: product,
        plan: "Standard",
        price: "N/A",
        payment: payment,
        platform: platform,
        email: email
      })
    })
      .then(res => res.json())
      .then(data => {
        loading.style.display = "none";

        if (!data || !data.success) {
          alert("Order failed. Try again.");
          return;
        }

        document.getElementById("successSound").play();
        document.getElementById("popupOrderId").innerText =
          "Order ID: " + redirectOrderId;
        document.getElementById("popup").style.display = "flex";
      })
      .catch(err => {
        console.error(err);
        loading.style.display = "none";
        alert("Server error. Try later.");
      });

  } catch (err) {
    console.error("JS ERROR:", err);
    alert("Script error. Check console.");
  }
}

/* =========================
   COPY ORDER ID
========================= */
function copyOrderId() {
  if (redirectOrderId) {
    navigator.clipboard.writeText(redirectOrderId);
  }
}

/* =========================
   CONFIRM REDIRECT
========================= */
function confirmRedirect() {
  if (!redirectOrderId) return;

  if (selectedPlatform === "telegram") {
    const msg =
      "Hello, I placed an order.\nOrder ID: " + redirectOrderId;

    window.location.href =
      "https://t.me/Delta_Market_Owner?text=" +
      encodeURIComponent(msg);
  }

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
