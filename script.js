// Theme Toggle
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;

// Toggle dark/light mode
themeSwitch.addEventListener("change", () => {
  body.classList.toggle("dark", themeSwitch.checked);
  body.classList.toggle("light", !themeSwitch.checked);
});

// Default to light theme
body.classList.add("light");

// QR Code Scanner
const video = document.getElementById("preview");
const result = document.getElementById("result");

async function startScanner() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    video.srcObject = stream;
    video.setAttribute("playsinline", true); // Required for iOS
    video.play();

    scanQRCode();
  } catch (err) {
    result.textContent = "Error accessing camera: " + err.message;
  }
}

function scanQRCode() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        result.textContent = `QR Code Content: ${code.data}`;
        video.pause(); // Stop scanning when a QR code is found
        return;
      }
    }

    requestAnimationFrame(tick);
  }

  tick();
}

// Start scanner on load
startScanner();
