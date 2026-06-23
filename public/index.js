let prompt = document.querySelector("#prompt");
let btn = document.querySelector("#btn");
let container = document.querySelector(".container");
let chatContainer = document.querySelector(".chat-container");

// API Keys
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCJM7RQIp2Nt7OT7wm-7g0UQ9k-fxUtjq4";
const UNSPLASH_API_KEY = "FZRKJ9FgX8BFQX9mUEQUCzSp3xSr2BOPSY_TdwnGD3A";

// Updated Utility Function to Create Chat Boxes
function createChatBox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

// Fetch AI Text Response
async function getApiResponse(aiChatBox, userMessage) {
    let textElement = aiChatBox.querySelector(".text");
    textElement.innerText = "Generating response..."; // Show this instead of loading gif

    try {
        let response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ "role": "user", "parts": [{ text: userMessage }] }]
            })
        });
        let data = await response.json();
        let apiResponse = data?.candidates[0]?.content?.parts[0]?.text || "No response from AI.";
        textElement.innerText = apiResponse;
    } catch (e) {
        console.error(e);
        textElement.innerText = "Error fetching AI response.";
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";
    }
}

// Fetch Image from Unsplash
async function getImageResponse(aiChatBox, query) {
    let imgElement = aiChatBox.querySelector(".img img");
    let downloadBtn = aiChatBox.querySelector(".download-btn");

    try {
        let response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_API_KEY}`);
        let data = await response.json();
        let imageUrl = data?.results[0]?.urls?.regular || "https://via.placeholder.com/150";
        imgElement.src = imageUrl;
        downloadBtn.href = imageUrl;
        downloadBtn.download = `${query.replace(" ", "_")}.jpg`;
    } catch (e) {
        console.error(e);
        imgElement.src = "https://via.placeholder.com/150";
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";
    }
}

// Show Loading Animation

function showLoading(isImage = false, query = "") {
    let html = `
        <div class="img">
          <img src="ai.webp" alt="" width="50">
        </div>
        <p class="text"><img src="loading.gif" alt="loading" class="loading" height="50" ></p>
        <a class="download-btn" href="#" style="display:none;">Download Image</a>
    `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);

    if (isImage) {
        getImageResponse(aiChatBox, query).then(() => {
            aiChatBox.querySelector(".download-btn").style.display = "inline-block";
        });
    } else {
        getApiResponse(aiChatBox, query);
    }
}

// Handle User Interaction
btn.addEventListener("click", () => {
    let userMessage = prompt.value.trim();
    if (userMessage === "") {
        container.style.display = "flex";
        return;
    }
    container.style.display = "none";

    let userHtml = `
        <div class="img">
            <img src="user.webp" alt="User" width="50">
        </div>
        <p class="text"></p>
    `;
    let userChatBox = createChatBox(userHtml, "user-chat-box");
    userChatBox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatBox);

    prompt.value = "";

    if (userMessage.toLowerCase().includes("image")) {
        let query = userMessage.replace(/image of|show me|picture of|search for/gi, "").trim();
        setTimeout(() => showLoading(true, query), 1000);
    } else {
        setTimeout(() => showLoading(false, userMessage), 1000);
        
    }
});



