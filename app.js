
const fileInput = document.getElementById("asset-file");
const fileInfo = document.getElementById("file-info");
const analyzeBtn = document.getElementById("analyze-btn");
const convertBtn = document.getElementById("convert-btn");
const engineStatus = document.getElementById("engine-status");
const conversionStatus = document.getElementById("conversion-status");
const result = document.getElementById("result");
const systemStatus = document.getElementById("system-status");

let selectedFile = null;
let analysisComplete = false;

const MAX_FILE_SIZE = 500 * 1024 * 1024;

fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files[0] || null;
  analysisComplete = false;

  if (!selectedFile) {
    fileInfo.textContent = "No file selected";
    return;
  }

  fileInfo.textContent =
    "FILE: " + selectedFile.name +
    " | SIZE: " +
    (selectedFile.size / 1024 / 1024).toFixed(2) +
    " MB";

  result.textContent = "Ready for asset analysis.";
  conversionStatus.textContent = "Conversion: NOT STARTED";
});

analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("Please select a file first.");
    return;
  }

  if (selectedFile.size > MAX_FILE_SIZE) {
    alert("File exceeds the 500 MB limit.");
    return;
  }

  systemStatus.textContent = "ANALYZING...";
  result.textContent = "Reading file header...";

  try {
    const buffer = await selectedFile
      .slice(0, 256 * 1024)
      .arrayBuffer();

    const bytes = new Uint8Array(buffer);

    const header = new TextDecoder()
      .decode(bytes.slice(0, 16));

    let format = "UNKNOWN";
    let details = "Format not recognized.";

    if (header.startsWith("UnityFS")) {
      format = "UnityFS";
      details = "Unity AssetBundle signature detected.";
    } else if (header.startsWith("UnityWeb")) {
      format = "UnityWeb";
      details = "Unity Web bundle signature detected.";
    } else if (header.startsWith("UnityRaw")) {
      format = "UnityRaw";
      details = "Unity Raw bundle signature detected.";
    } else if (header.startsWith("UnityArchive")) {
      format = "UnityArchive";
      details = "Unity Archive signature detected.";
    } else if (
      bytes[0] === 0x50 &&
      bytes[1] === 0x4B
    ) {
      format = "ZIP";
      details = "ZIP archive signature detected.";
    }

    analysisComplete = true;

    result.textContent =
      "ANALYSIS COMPLETE\n" +
      "FILE: " + selectedFile.name + "\n" +
      "SIZE: " + selectedFile.size + " bytes\n" +
      "FORMAT: " + format + "\n" +
      "DETAILS: " + details + "\n" +
      "INSPECTION: Header sample only.\n" +
      "FULL EXTRACTION: NOT PERFORMED.";

    systemStatus.textContent = "ANALYSIS COMPLETE";

  } catch (error) {
    analysisComplete = false;
    systemStatus.textContent = "ANALYSIS ERROR";
    result.textContent = "ERROR: " + error.message;
  }
});

convertBtn.addEventListener("click", () => {
  if (!selectedFile) {
    alert("Please select an AssetBundle first.");
    return;
  }

  if (!analysisComplete) {
    alert("Please analyze the file first.");
    return;
  }

  engineStatus.textContent =
    "Backend: NOT CONNECTED";

  conversionStatus.textContent =
    "Conversion: WAITING FOR PYTHON BACKEND";

  result.textContent =
    "Analysis is available.\n" +
    "Actual Android to iOS conversion has not started.\n" +
    "Python conversion backend is required.";

  systemStatus.textContent =
    "BACKEND CONNECTION REQUIRED";
});

engineStatus.textContent = "Backend: NOT CONNECTED";
conversionStatus.textContent = "Conversion: NOT STARTED";
systemStatus.textContent = "LOCAL INSPECTION READY";

console.log("CADENZZA ENGINE INITIALIZED");
