const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const apiKey = "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";
let isImaeGenerateing = false;

const udpateImageCard = (imageDataArray) => {
    imageDataArray.forEach((imageObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".image-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadButton = imgCard.querySelector(".download-button");

        const aiGeneratedImg = `data:image/jpeg;base64,${imageObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        // when the image is loaded, remove the loading class and set download attributes
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadButton.setAttribute("href", aiGeneratedImg);
            downloadButton.setAttribute(
                "download",
                `${new Date().getTime()}.jpg`
            );
        };
    });
};

const generateAiImage = async (userPrompt, userImageQuantity) => {
    try {
        // send request to openAi api to generate images based on user inputs
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                    n: parseInt(userImageQuantity),
                    size: "512x512",
                    response_format: "b64_json",
                }),
            }
        );

        if (!response.ok)
            throw Error("Failed to generate images! Please try again.");

        const { data } = await response.json(); // Get data from the response
        udpateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    }finally{
        isImaeGenerateing = false
    }
};

const handelFormSubmission = (e) => {
    e.preventDefault();
    if (isImaeGenerateing) return;
    isImaeGenerateing = true;

    // Get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImageQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from(
        { length: userImageQuantity },
        () =>
            `<div class="image-card loading">
                <img src="images/loader.svg" alt="image">
                <a href="#" class="download-button">
                    <img src="images/download.svg" alt="download-icon">
                </a>
            </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImage(userPrompt, userImageQuantity);
};

generateForm.addEventListener("submit", handelFormSubmission);
