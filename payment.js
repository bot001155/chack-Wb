const BACKEND_URL = "https://delta-backend-3ztx.onrender.com";

let selectedPlatform = "";
let orderId = "";

function placeOrder(platform) {
  const name = document.getElementById("name").value.trim();
  const product = document.getElementById("product").value.trim();
  const email = document.getElementById("email").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !product || !email) {
    alert("Fill all details");
    return;
  }

  selectedPlatform = platform;
  orderId = "DM-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  document.getElementById("loader").style.display = "flex";

  fetch(`${BACKEND_URL}/send-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      name,
      product,
      email,
      payment,
      platform
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loader").style.display = "none";

      if (!data.success) {
        alert("Order failed");
        return;
      }

      document.getElementById("orderId").innerText =
        "Order ID: " + orderId;
      document.getElementById("success").style.display = "flex";
    })
    .catch(() => {
      document.getElementById("loader").style.display = "none";
      alert("Server error");
    });
}

function continueChat() {
  if (selectedPlatform === "telegram") {
    window.location.href =
      "https://t.me/Delta_Market_Owner?text=" +
      encodeURIComponent("Order ID: " + orderId);
  } else {
    window.location.href = "https://ig.me/m/deltamarket015";
  }
}

