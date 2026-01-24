// ==============================
// BACKEND API URL (Railway)
// ==============================
const API = "https://backend-production-2cbc.up.railway.app";

// ==============================
// HELPERS
// ==============================
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

// ==============================
// START ORDER (BUY BUTTON)
// ==============================
async function startOrder(planName, price) {
  try {
    // Example input ids (change if your HTML ids are different)
    const fullName = getValue("fullName");
    const telegram = getValue("telegram");
    const email = getValue("email");

    if (!fullName) {
      alert("Please enter Full Name");
      return;
    }

    if (!telegram) {
      alert("Please enter Telegram Username");
      return;
    }

    if (!email) {
      alert("Please enter Email");
      return;
    }

    // OPTIONAL: show loading
    setText("statusText", "Processing order...");
    show("statusBox");

    // ==============================
    // CALL BACKEND: START ORDER
    // ==============================
    // ⚠️ Change endpoint if your backend uses different route name
    const res = await fetch(`${API}/start-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        telegram,
        email,
        planName,
        price,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Start order error:", data);
      alert(data.message || "Order failed. Try again.");
      return;
    }

    // Save orderId in localStorage so we can verify OTP later
    if (data.orderId) {
      localStorage.setItem("orderId", data.orderId);
    }

    setText("statusText", "Order started ✅ Now send OTP");
    alert("Order started ✅ Now send OTP to your email.");

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check console.");
  }
}

// ==============================
// SEND OTP
// ==============================
async function sendOtp() {
  try {
    const email = getValue("email");

    if (!email) {
      alert("Enter your email first");
      return;
    }

    setText("statusText", "Sending OTP...");
    show("statusBox");

    // ⚠️ Change endpoint if your backend uses different route name
    const res = await fetch(`${API}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Send OTP error:", data);
      alert(data.message || "OTP failed to send.");
      return;
    }

    setText("statusText", "OTP sent ✅ Check your email");
    alert("OTP sent ✅ Check your email (Spam also).");

  } catch (err) {
    console.error(err);
    alert("OTP send error. Check console.");
  }
}

// ==============================
// VERIFY OTP
// ==============================
async function verifyOtp() {
  try {
    const email = getValue("email");
    const otp = getValue("otp");

    const orderId = localStorage.getItem("orderId");

    if (!email) {
      alert("Enter your email");
      return;
    }

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setText("statusText", "Verifying OTP...");
    show("statusBox");

    // ⚠️ Change endpoint if your backend uses different route name
    const res = await fetch(`${API}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        orderId, // optional (if your backend needs it)
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Verify OTP error:", data);
      alert(data.message || "OTP invalid / expired");
      return;
    }

    setText("statusText", "OTP verified ✅ Order confirmed");
    alert("OTP verified ✅ Your order is confirmed!");

    // OPTIONAL: redirect after success
    // window.location.href = "success.html";

  } catch (err) {
    console.error(err);
    alert("OTP verify error. Check console.");
  }
}

// ==============================
// OPTIONAL: Make functions global
// so HTML onclick can call them
// ==============================
window.startOrder = startOrder;
window.sendOtp = sendOtp;
window.verifyOtp = verifyOtp;
