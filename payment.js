const API = "https://delta-backend-3ztx.onrender.com";
const VALID_REFERRALS = ["REIO50", "SHU50", "FLASH50"];

let cache = {};

/* ======================
   START ORDER
====================== */
function startOrder(platform) {
  cache.platform = platform;
  cache.name = document.getElementById("name").value.trim();
  cache.product = document.getElementById("product").value.trim();
  cache.email = document.getElementById("email").value.trim();
  cache.payment = document.getElementById("payment").value;

  if (!cache.name || !cache.product || !cache.email) {
    alert("Please fill all fields");
    return;
  }

cache.referral = (document.getElementById("referral")?.value || "").trim().toUpperCase();

// Optional but must be valid if entered
if (cache.referral && !VALID_REFERRALS.includes(cache.referral)) {
  alert("Invalid referral code.");
  return;
}

   

   
  fetch(API + "/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: cache.email })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Failed to send OTP");
        return;
      }
      document.getElementById("otpBox").style.display = "flex";
    })
    .catch(() => alert("Server error"));
}

/* ======================
   VERIFY OTP
====================== */
function verifyOtp() {
  const otp = document.getElementById("otp").value.trim();

  fetch(API + "/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: cache.email,
      otp: otp,
      orderData: cache
    })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert("Invalid OTP");
        return;
      }

      document.getElementById("otpBox").style.display = "none";
      document.getElementById("orderIdText").innerText =
        "Order ID: " + data.orderId;
      document.getElementById("successBox").style.display = "flex";

      cache.orderId = data.orderId;
    })
    .catch(() => alert("Server error"));
}

/* ======================
   REDIRECT TO TELEGRAM
====================== */
function goTelegram() {
  window.location.href =
    "https://t.me/Delta_Market_Owner?text=" +
    encodeURIComponent("Order ID: " + cache.orderId);
}
function goDiscord() {
  window.location.href =
    "https://discord.gg/mWK5Kt6WRt";
}



