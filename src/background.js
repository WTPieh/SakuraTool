/*
 * This extension is the property of William Pieh and PiehSoft LLC.
 * It is being distributed under the MIT License.
 *
 * MIT License
 *
 * Copyright (c) 2026 William Pieh and PiehSoft LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/// <reference path="./types/typedef.js" />
const dynamicReferencePattern = /\$\w\d*|\$\d+\w*/g;
const dynamicValuePattern = /\w\d*:\$?\d*\w*:/g;
const __DOMAIN__ = /^https:\/\/www\.sakura\.fm\/chat\/[a-zA-Z0-9]+$/;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  if (message.type === 'download') {
    console.log('Processing download request for tab:', message.tabId);
    handleDownload(message.tabId, message.url);
  }
});

async function handleDownload(tabId, url) {
  console.log('Starting download process for URL:', url);
  try {
    if (!url) {
      console.error('No URL provided');
      throw new Error('No URL provided');
    }

    const cleanUrl = url.split("?")[0];
    console.log('Cleaned URL:', cleanUrl);
    console.log('Testing URL against pattern:', __DOMAIN__);
    console.log('Pattern test result:', __DOMAIN__.test(cleanUrl));
    
    if (!__DOMAIN__.test(cleanUrl)) {
      console.log('URL does not match domain pattern');
      // Send error message to popup
      chrome.runtime.sendMessage({
        type: 'status',
        status: 'error',
        message: chrome.i18n.getMessage('wrongPageMessage')
      });
      return;
    }

    console.log('URL matches domain pattern, fetching character data');
    // The URL matches the intended domain and path, proceed with the functionality
    const data = await fetchAndCopyCharacterData(cleanUrl);
    if (!data) {
      console.error('Failed to fetch character data');
      throw new Error('Failed to fetch character data');
    }
    
    console.log('Character data fetched successfully:', data.name);
    
    let messages = "";
    let isEmpty =
      data.exampleConversation[0].content === "" &&
      data.exampleConversation[1].content === "";
    if (data.exampleConversation.length > 2 && !isEmpty) {
      messages = "<START>\n";
      for (let i = 0; i < data.exampleConversation.length; i++) {
        let role = i % 2 === 0 ? "{{user}}" : "{{char}}";
        messages += role + ": " + data.exampleConversation[i].content + "\n";
      }
    }
    const character = {
      char_name: data.name,
      char_persona: data.persona,
      char_greeting: data.firstMessage,
      world_scenario: data.scenario,
      example_dialogue: messages,
      name: data.name,
      description: data.description,
      first_mes: data.firstMessage,
      scenario: data.scenario,
      mes_example: messages,
      personality: data.persona,
      metadata: {
        version: 1,
        created: Date.now(),
        modified: Date.now(),
        source: null,
        tool: {
          name: "SakuraTool",
          version: "1.1.1",
          url: "https://github.com/WTPieh/SakuraTool",
        },
      },
    };

    console.log('Injecting download script into tab:', tabId);
    // Inject the download function and run it in the context of the tab
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (character) => {
        /** @type {CharacterSakura} jsonObject*/
        const downloadJsonData = (
          /** @type {CharacterSakura} jsonObject*/ jsonObject,
        ) => {
          console.log('Starting download in content script');
          // Convert JSON object to a string
          const jsonString = JSON.stringify(jsonObject, null, 2);

          // Create a Blob with the JSON string and set the MIME type to application/json
          const blob = new Blob([jsonString], { type: "application/json" });

          // Create a temporary anchor element
          const link = document.createElement("a");

          // Create a URL for the Blob and set it as the href attribute
          link.href = URL.createObjectURL(blob);

          // Set the download attribute with a filename
          link.download = `character_${jsonObject.name}.json`;

          // Append the anchor to the body (required for Firefox)
          document.body.appendChild(link);

          // Programmatically click the link to trigger the download
          link.click();

          // Remove the anchor from the document
          document.body.removeChild(link);

          // Revoke the Blob URL to free up memory
          URL.revokeObjectURL(link.href);
          console.log('Download completed in content script');
        };

        downloadJsonData(character);
      },
      args: [character],
    });

    console.log('Sending success message to popup');
    // Send success message to popup
    chrome.runtime.sendMessage({
      type: 'status',
      status: 'success',
      message: chrome.i18n.getMessage('successMessage', [character.name])
    });
  } catch (error) {
    console.error('Error in handleDownload:', error);
    // Send error message to popup
    chrome.runtime.sendMessage({
      type: 'status',
      status: 'error',
      message: chrome.i18n.getMessage('errorMessage')
    });
  }
}

// Keep the action click handler for backward compatibility
chrome.action.onClicked.addListener((tab) => {
  console.log('Action clicked for tab:', tab);
  if (tab && tab.url) {
    handleDownload(tab.id, tab.url);
  }
});

/** @type {CharacterSakura} */
async function fetchAndCopyCharacterData(weburl) {
  try {
    const url = weburl.split("?")[0];

    const response = await fetch(url, {
      method: "GET",
      credentials: "omit",
      headers: {
        accept: "*/*",
        rsc: "1",
        "next-router-state-tree":
          "%5B%22%22%2C%7B%22children%22%3A%5B%5B%22lang%22%2C%22en%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22chat%22%2C%7B%22children%22%3A%5B%5B%22character-id%22%2C%224Xa0Rsc%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22__PAGE__%3F%7B%5C%22id%5C%22%3A%5C%22latest%5C%22%2C%5C%22search%5C%22%3A%5C%22eyJhbGxvd05zZnciOmZhbHNlLCJibG9ja2VkT25seSI6ZmFsc2UsImNyZWF0b3JJZCI6bnVsbCwiZmF2b3JpdGVzT25seSI6ZmFsc2UsImZvbGxvd2luZ09ubHkiOmZhbHNlLCJsaW1pdCI6MzAsIm1hdGNoVHlwZSI6ImFsbCIsInJlc3VsdEluZGV4IjowLCJzZWFyY2giOiIiLCJzb3J0VHlwZSI6Im1lc3NhZ2UtY291bnQiLCJ0YWdzIjpbXX0%3D%5C%22%2C%5C%22lang%5C%22%3A%5C%22en%5C%22%2C%5C%22character-id%5C%22%3A%5C%224Xa0Rsc%5C%22%7D%22%2C%7B%7D%2C%22%2Fchat%2F4Xa0Rsc%3Fid%3Dlatest%26search%3DeyJhbGxvd05zZnciOmZhbHNlLCJibG9ja2VkT25seSI6ZmFsc2UsImNyZWF0b3JJZCI6bnVsbCwiZmF2b3JpdGVzT25seSI6ZmFsc2UsImZvbGxvd2luZ09ubHkiOmZhbHNlLCJsaW1pdCI6MzAsIm1hdGNoVHlwZSI6ImFsbCIsInJlc3VsdEluZGV4IjowLCJzZWFyY2giOiIiLCJzb3J0VHlwZSI6Im1lc3NhZ2UtY291bnQiLCJ0YWdzIjpbXX0%253D%22%2C%22refresh%22%5D%7D%5D%7D%2Cnull%2C%22refetch%22%5D%7D%5D%7D%5D",
        "accept-language": "en,en-US;q=0.9,ja;q=0.8,la;q=0.7",
      },
    });

    const textResponse = await response.text();

    const dataObject = primaryData(textResponse);
    if (dynamicReferencePattern.test(dataObject.persona)) {
      let persona = personaData(textResponse, dataObject.persona);
      dataObject.persona = persona;
    }
    if (dynamicReferencePattern.test(dataObject.scenario)) {
      let scenario = personaData(textResponse, dataObject.scenario);
      dataObject.scenario = scenario;
    }
    if (dynamicReferencePattern.test(dataObject.firstMessage)) {
      let firstMessage = retrieveData(textResponse, dataObject.firstMessage);
      dataObject.firstMessage = firstMessage;
    }
    if (dynamicReferencePattern.test(dataObject.description)) {
      let description = retrieveData(textResponse, dataObject.description);
      dataObject.description = description;
    }
    if (dynamicReferencePattern.test(dataObject.name)) {
      let name = retrieveData(textResponse, dataObject.name);
      dataObject.name = name;
    }
    return dataObject;
  } catch (error) {
    console.warn("Error fetching character data:", error);
    return null;
  }
}
/** @param {string} dataObject */
function primaryData(dataObject) {
  const dataIndex = dataObject.indexOf('{"success":true,"data"');

  if (dataIndex === -1) {
    console.warn("Data object not found in the response.");
    return null;  // Return null instead of undefined
  }

  // Instead of looking for ":false}}", properly parse the JSON
  // Find the complete JSON object by counting braces
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let dataEndIndex = -1;
  
  for (let i = dataIndex; i < dataObject.length; i++) {
    const char = dataObject[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          dataEndIndex = i + 1;
          break;
        }
      }
    }
  }
  
  if (dataEndIndex === -1) {
    console.warn("Could not find end of JSON object");
    return null;
  }

  let data = dataObject.substring(dataIndex, dataEndIndex);
  const primaryData = JSON.parse(data).data;
  const character = primaryData.character;
  return character;
}

/**
 * @param {string} dataObject
 * @param {string} personaIndex
 */
function personaData(dataObject, personaCharIndex) {
  const index = personaCharIndex.split("$")[1] + ":";
  const personaIndex = dataObject.indexOf(index);

  if (personaIndex === -1) {
    console.warn("Data object not found in the response.");
    return;
  }

  const personaEndIndex = dataObject.indexOf("9:", personaIndex);
  let persona = dataObject.substring(personaIndex, personaEndIndex);
  persona = persona.substring(persona.indexOf(",") + 1, persona.length - 1);

  return persona;
}

/** @param {string} dataObject
 * @param {string} charIndex
 */
function retrieveData(dataObject, charIndex) {
  const index = charIndex.split("$")[1] + ":";
  const dataIndex = dataObject.indexOf(index);

  if (dataIndex === -1) {
    console.warn("Data object not found in the response.");
    return;
  }

  let value = dynamicValuePattern.exec(dataObject);
  value = value[0];
  let len = value.length;

  let dataEndIndex = dataObject.indexOf(value, dataIndex) + len;
  let data = dataObject.substring(dataIndex, dataEndIndex);
  data = data.substring(data.indexOf(",") + 1, data.length - 1);

  return data;
}
