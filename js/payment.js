let selectedPlatform = "";
let redirectOrderId = "";

const BACKEND_URL = "https://delta-backend.onrender.com";

function sendOrder(platform) {
  const name = document.getElementById("name").value.trim();
  const product = document.getElementById("product").value.trim();
  const email = document.getElementById("email").value.trim();
  const payment = document.getElementById("payment").value;
  const loading = document.getElementById("loading");

  if (!name || !product || !email) {
    alert("Fill all fields");
    return;
  }

  selectedPlatform = platform;
  redirectOrderId = "DMS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  loading.style.display = "flex";

  fetch(`${BACKEND_URL}/send-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: redirectOrderId,
      name,
      product,
      email,
      payment,
      platform
    })
  })
  .then(res => res.json())
  .then(data => {
    loading.style.display = "none";
    if (!data.success) {
      alert("Order failed");
      return;
    }
    document.getElementById("popupOrderId").innerText =
      "Order ID: " + redirectOrderId;
    document.getElementById("popup").style.display = "flex";
  })
  .catch(() => {
    loading.style.display = "none";
    alert("Server error");
  });
}

function confirmRedirect() {
  if (selectedPlatform === "telegram") {
    window.location.href =
      "https://t.me/Delta_Market_Owner?text=" +
      encodeURIComponent("Order ID: " + redirectOrderId);
  }
  if (selectedPlatform === "instagram") {
    window.location.href = "https://ig.me/m/deltamarket015";
  }
}
