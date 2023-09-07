const coverImage = "images/slot_cover/cherry_cover.png"; // Replace with the actual path to your cover image
const coverText = ""; // Replace with the text you want to display on the cover

// fill all slotImage with coverImage
slotImages = document.querySelectorAll(".slotImage");
slotImages.forEach((slotImage) => {
  slotImage.src = coverImage;
});

const slots = ["slot1", "slot2", "slot3", "slot4"];

let intervals = {};

let spinning = false;

function spinAll() {
  if (spinning) return; // Exit if already spinning

  spinning = true;

  // Disable the spin button spinResetButton button
  document.getElementById("spinShareButton").disabled = true;
  document.getElementById("resetButton").disabled = true;

  slots.forEach((_, index) => {
    spin(index);
  });

  let delay = 2000;
  let increment = 1000;
  let lastSlot = slots.length - 1;

  slots.forEach((_, index) => {
    setTimeout(() => {
      stopSpinning(index);

      // Enable the button when the last slot has stopped
      if (index === lastSlot) {
        document.getElementById("spinShareButton").disabled = false;
        document.getElementById("resetButton").disabled = false;
        spinning = false;
      }
    }, delay + index * increment);
  });
}

function spin(slotIndex) {
  let data = dataList[slotIndex];
  let slotId = `slot${slotIndex + 1}`;
  let slotElement = document.getElementById(slotId);
  let imageElement = slotElement.querySelector(".slotImage");
  let textElement = slotElement.querySelector(".slotText");

  imageElement.classList.add("blur");
  textElement.classList.add("blur-text");

  let currentIndex = 0;
  intervals[slotId] = setInterval(() => {
    let currentItem = data[currentIndex];
    imageElement.src = currentItem.image;
    textElement.textContent = currentItem.text;
    currentIndex = (currentIndex + 1) % data.length;
  }, 100);
}

function stopSpinning(slotIndex) {
  let slotId = `slot${slotIndex + 1}`;
  clearInterval(intervals[slotId]);

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
}
