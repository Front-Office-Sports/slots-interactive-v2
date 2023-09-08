const coverImage = "images/slot_cover/cherry_cover.png"; // Replace with the actual path to your cover image
const coverText = ""; // Replace with the text you want to display on the cover

const newImageEvery = 70; // Change this to the number of milliseconds you want to wait before changing the image
const spinFor = 1500; // Change this to the number of milliseconds you want to spin for
const stopEvery = 500; // Change this to the number of milliseconds you want to wait before stopping each slot

const gameUrl = "https://frontofficesports.com/nfl-fantasy-franchise/";

// fill all slotImage with coverImage
slotImages = document.querySelectorAll(".slotImage");
slotImages.forEach((slotImage) => {
  slotImage.src = coverImage;
});

const slots = ["slot1", "slot2", "slot3", "slot4"];

let intervals = {};

let spinning = false;

let animationIds = {}; // To store animation request IDs for each slot

function spinAll() {
  if (spinning) return; // Exit if already spinning

  spinning = true;

  // Disable the spin button spinResetButton button
  document.getElementById("spinShareButton").disabled = true;
  document.getElementById("resetButton").disabled = true;

  slots.forEach((_, index) => {
    spin(index);
  });

  let delay = spinFor;
  let increment = stopEvery;
  let lastSlot = slots.length - 1;

  slots.forEach((_, index) => {
    setTimeout(() => {
      stopSpinning(index);

      // Enable the button when the last slot has stopped
      if (index === lastSlot) {
        // Enable the spin button spinResetButton button
        document.getElementById("spinShareButton").disabled = false;
        document.getElementById("resetButton").disabled = false;
        spinning = false;
        // Change the text of the button to 'Share'
        spinShareButton.innerText = "Share";
      }
    }, delay + index * increment);
  });
}

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function spinOld(slotIndex) {
  let data = dataList[slotIndex];

  // Shuffle the data and pick the first 10 items
  let randomSubset = shuffleArray([...data]).slice(0, 10);

  let slotId = `slot${slotIndex + 1}`;
  let slotElement = document.getElementById(slotId);
  let imageElement = slotElement.querySelector(".slotImage");
  let textElement = slotElement.querySelector(".slotText");

  imageElement.classList.add("blur");
  // textElement.classList.add("blur-text");

  let currentIndex = 0;
  intervals[slotId] = setInterval(() => {
    let currentItem = randomSubset[currentIndex];
    imageElement.src = currentItem.image;
    textElement.textContent = currentItem.text;
    currentIndex = (currentIndex + 1) % randomSubset.length;
  }, newImageEvery);
}

function spin(slotIndex) {
  let data = dataList[slotIndex];

  // Shuffle the data and pick the first 10 items
  let randomSubset = shuffleArray([...data]).slice(0, 32);

  let slotId = `slot${slotIndex + 1}`;
  let slotElement = document.getElementById(slotId);
  let imageElement = slotElement.querySelector(".slotImage");
  let textElement = slotElement.querySelector(".slotText");

  imageElement.classList.add("blur");
  textElement.classList.add("blur-text");

  // hide the text
  // textElement.classList.add("hidden");

  let currentIndex = 0;
  let startTime = null;

  // Cancel any existing animation for this slot
  if (animationIds[slotId]) {
    cancelAnimationFrame(animationIds[slotId]);
  }

  function animate(time) {
    if (!startTime) startTime = time;

    let elapsed = time - startTime;

    if (elapsed > newImageEvery) {
      let currentItem = randomSubset[currentIndex];
      imageElement.src = currentItem.image;
      textElement.textContent = currentItem.text;
      currentIndex = (currentIndex + 1) % randomSubset.length;
      startTime = time; // Reset the start time
    }

    animationIds[slotId] = requestAnimationFrame(animate);
  }

  animationIds[slotId] = requestAnimationFrame(animate);
}

function stopSpinningOld(slotIndex) {
  // let slotId = `slot${slotIndex + 1}`;
  // clearInterval(intervals[slotId]);

  let data = dataList[slotIndex];
  let slotElement = document.getElementById(slotId);
  let imageElement = slotElement.querySelector(".slotImage");
  let textElement = slotElement.querySelector(".slotText");

  // imageElement.classList.remove("blur");
  textElement.classList.remove("blur-text");

  let randomIndex = Math.floor(Math.random() * data.length);
  let randomItem = data[randomIndex];
  imageElement.src = randomItem.image;
  textElement.textContent = randomItem.text;
}

function stopSpinning(slotIndex) {
  let slotId = `slot${slotIndex + 1}`;
  cancelAnimationFrame(animationIds[slotId]); // Stop the animation

  let data = dataList[slotIndex];
  let slotElement = document.getElementById(slotId);
  let imageElement = slotElement.querySelector(".slotImage");
  let textElement = slotElement.querySelector(".slotText");

  textElement.classList.remove("blur-text");

  let randomIndex = Math.floor(Math.random() * data.length);
  let randomItem = data[randomIndex];
  imageElement.src = randomItem.image;
  textElement.textContent = randomItem.text;
}

function resetSlots() {
  slots.forEach((slotId) => {
    let slotElement = document.getElementById(slotId);
    let imageElement = slotElement.querySelector(".slotImage");
    let textElement = slotElement.querySelector(".slotText");

    imageElement.src = coverImage;
    textElement.textContent = coverText;

    // If you want to remove the blur effect when resetting, uncomment the line below
    imageElement.classList.remove("blur");
  });

  // Change the text of the button to 'Spin'
  spinShareButton.innerText = "Spin";
}

// Function to open the share modal
function shareFunction() {
  console.log("shareFunction");
  const modal = document.getElementById("shareModal");
  modal.style.display = "block";
  displayResultsInModal(); // Populate the modal with the results
}

// Function to close the share modal
function closeModal() {
  const modal = document.getElementById("shareModal");
  modal.style.display = "none";
}

function shareCopyText() {
  console.log("shareCopyText");
  const shareContent = document.getElementById("shareContent").textContent;

  // Copy to clipboard
  navigator.clipboard
    .writeText(shareContent)
    .then(() => {
      // Show popup
      const copyPopup = document.getElementById("copyPopup");
      copyPopup.style.opacity = "1";

      // Hide popup after 3 seconds
      setTimeout(() => {
        copyPopup.style.opacity = "0";
      }, 3000);
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

// Function to share to Facebook
function shareToFacebook() {
  // Your Facebook sharing code here
  // You can close the modal after sharing
  console.log("shareToFacebook");

  var facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    gameUrl
  )}`;
  window.open(facebookShareUrl, "_blank");
}

// Function to share to Twitter
function shareToTwitter() {
  // Your Twitter sharing code here
  // You can close the modal after sharing
  console.log("shareToTwitter");

  // Fetch the content from the innerHTML of the element with id 'shareContent'
  const shareHTML = document.getElementById("shareContent").innerHTML;

  // Replace <br> with newline character
  const shareContent = shareHTML.replace(/<br>/g, "\n");

  // Replace new lines with URL-encoded new lines
  const formattedShareContent = encodeURIComponent(shareContent);

  // Create the tweet text
  const tweetText =
    encodeURIComponent("My NFL fantasy franchise, generated by @FOS:\n") +
    formattedShareContent +
    encodeURIComponent("\nPlay: ") +
    gameUrl;

  // Open Twitter in a new tab with the pre-filled tweet
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
}

function spinOrShare() {
  const spinShareButton = document.getElementById("spinShareButton");

  if (spinShareButton.innerText === "Spin") {
    spinAll();
  } else if (spinShareButton.innerText === "Share") {
    // Call your share function here
    shareFunction();
  }
}

function displayResultsInModal() {
  let shareContent = document.getElementById("shareContent");
  let results = [];

  // Map each title to an emoji
  const emojis = {
    City: "🏢",
    Owner: "💵",
    Coach: "📢",
    QB: "🏈",
  };

  // Fetch text from each slot
  for (let i = 1; i <= 4; i++) {
    let slotId = `slot${i}`;
    let slotElement = document.getElementById(slotId);
    let textElement = slotElement.querySelector(".slotText");
    let title = document
      .querySelector(`.slot-and-title:nth-child(${i}) h2`)
      .textContent.trim();
    let text = textElement.textContent;
    let emoji = emojis[title] || ""; // Use an empty string as a fallback

    results.push(`${emoji} ${title}: ${text}`);
  }

  // Update the modal content
  shareContent.innerHTML = results.join("<br>");
}
