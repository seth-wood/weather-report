// Add a specified delay in milliseconds
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// Write text to a target element with a specified delay in ms
function writeText(target, content, delay = 5) {
  // Loop through array of content characters
  return new Promise((resolve) => {
    // Make an array of the specified content
    const contentArray = content.split("");

    // Keep track of the character currently being written
    let current = 0;

    while (current < contentArray.length) {
      ((curr) => {
        setTimeout(() => {
          target.innerHTML += contentArray[curr];
          // Scroll to the bottom of the screen unless scroll is false
          window.scrollTo(0, document.body.scrollHeight);

          // Resolve the promise once the last character is written
          if (curr === contentArray.length - 1) resolve();
        }, delay * curr); // increase delay with each iteration
      })(current++);
    }
  });
}

// Handle keypress on the document, printing them to an
// 'input' span. Input content will be interpreted as a
// command and output will be written to an output element
function handleKeypress(e, input, output) {
  // Check if a certain type of element has focus that we do not
  // want to do keypress handling on (such as form inputs)
  function noInputHasFocus() {
    const elements = ["INPUT", "TEXTAREA", "BUTTON"];
    return elements.indexOf(document.activeElement.tagName) === -1;
  }

  if (noInputHasFocus) {
    // Enter clears the input and executes the command
    if (e.key === "Enter") {
      const command = input.innerText;
      input.innerHTML = "";
      // reprint the entered command
      output.innerHTML += "<br><strong>" + command + "</strong>\n<br>";
      writeText(output, execute(command));
    }
    // Backspace causes last character to be erased
    else if (e.key === "Backspace") {
      input.innerHTML = input.innerHTML.substring(
        0,
        input.innerHTML.length - 1
      );
    }
    // For any other key, print the keystroke to the prompt
    else input.insertAdjacentText("beforeend", e.key);
  }

  // Accept a command, execute it, and return any output
  function execute(command) {
    switch (command.toLowerCase()) {
      case "":
        return `\n`;

      case "clear":
        asciiText.style.display = "none";
        output.innerHTML = "";
        return "";

      case "help":
        return `Enter a command here and something will be output.
  Valid options are:
  [us zip code] - will provide weather
   help - this help text
   clear - clear the screen`;

      default:
        if (/^\d{5}$/.test(command)) {
          fetchWeather(command);
        } else {
          output.innerHTML = `Command not recognized: ${command}`;
        }
        break;
    }
  }
}

// Execute page loading asynchronously once content has loaded
document.addEventListener("DOMContentLoaded", async () => {
  const asciiText = document.getElementById("asciiText");
  // Store the content of asciiText, then empty it
  const asciiArt = asciiText.innerText;
  asciiText.innerHTML = "";

  const instructions = document.getElementById("instructions");
  const prompt = document.getElementById("prompt");
  const cursor = document.getElementById("cursor");

  await wait(1000);
  await writeText(asciiText, asciiArt);
  await wait(500);
  await writeText(
    instructions,
    `Enter zip code for forecast. Type 'help' to see a list of commands.\n\n`
  );
  prompt.prepend(">");
  cursor.innerHTML = "_";

  const input = document.getElementById("command-input");
  const output = document.getElementById("output");
  document.addEventListener("keydown", (e) => handleKeypress(e, input, output));
});

async function fetchWeather(zipCode) {
  output.innerHTML = "Fetching weather data...";
  try {
    const response = await fetch("/get-weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${zipCode}`,
    });
    const data = await response.json();
    if (data.success) {
      const formattedForecast = data.forecast.split(". ").join(".\n");
      output.innerHTML = `Weather forecast for ${zipCode}:\n\n${formattedForecast}\n\n`;
    } else {
      output.innerHTML = `Error fetching weather data: ${JSON.stringify(
        data.error,
        null,
        2
      )}\n\n`;
    }
  } catch (error) {
    console.error("Error:", error);
    output.innerHTML = "An error occurred while fetching the weather data.\n\n";
  }
}
