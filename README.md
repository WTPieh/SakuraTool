# SakuraTool - Chrome Extension

A Chrome extension for downloading character data from Sakura.fm chat pages.

## Description

SakuraTool is a Chrome extension that allows users to easily download character data from Sakura.fm chat pages. The extension extracts character information including name, persona, scenario, and example dialogues, and saves them in a standardized JSON format.

## Features

- One-click character data download
- Extracts comprehensive character information:
  - Character name
  - Persona/Personality
  - Scenario/World setting
  - First message
  - Example dialogues
  - Description
- Saves data in a standardized JSON format
- Supports dynamic content extraction
- User-friendly popup interface
- Internationalization support

## Installation

1. Clone this repository:
```bash
git clone https://github.com/WTPieh/SakuraTool.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to any character chat page on Sakura.fm (e.g., `https://www.sakura.fm/chat/[character-id]`)

2. Click the SakuraTool extension icon in your browser toolbar

3. Click the "Download" button in the popup

4. The character data will be downloaded as a JSON file

## Development

### Project Structure

```
SakuraTool/
├── src/
│   ├── popup.jsx        # Popup UI component
│   └── popup.html       # Popup HTML template
├── _locales/           # Internationalization files
│   └── en/
│       └── messages.json
├── background.js       # Background script
├── manifest.json       # Extension manifest
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite build configuration
```

### Building

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

### Development Tools

- React for UI components
- TailwindCSS for styling
- Vite for building
- Chrome Extension APIs for browser integration

## Technical Details

### URL Pattern Matching

The extension uses a strict regex pattern to validate Sakura.fm chat URLs:
```javascript
/^https:\/\/www\.sakura\.fm\/chat\/[a-zA-Z0-9]+$/
```

### Data Extraction

The extension handles both static and dynamic content:
- Static content is extracted directly from the page
- Dynamic content is processed using pattern matching and data retrieval functions

### Error Handling

The extension includes comprehensive error handling for:
- Invalid URLs
- Missing character data
- Network errors
- Download failures

## License

MIT License

Copyright (c) 2024 William Pieh and PiehSoft LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Sakura.fm for providing the platform
- Chrome Extension development community
- All contributors and users of the extension 