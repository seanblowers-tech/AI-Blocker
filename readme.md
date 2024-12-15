# **AI Blocker Chrome Extension**

**AI Blocker** is a Chrome extension designed to block websites and features related to advanced AI services while giving users control to manage a blocklist and allowlist dynamically.

---

## **Features**

- 🚫 **Blocks AI-Related Websites**: Automatically blocks domains like ChatGPT, Google Bard, and more.
- 📝 **Customizable Blocklist**: Add or remove websites to/from your blocklist.
- ✅ **Allowlist Functionality**: Websites removed from the blocklist are moved to the allowlist.
- 🔄 **Default Blocklist**: Includes predefined AI-related domains such as:
   - `openai.com`
   - `bard.google.com`
   - `gemini.google.com`
   - `chatgpt.com`
- 🌐 **Google Search Filtering**: Automatically appends `-ai` to Google search queries to exclude AI-generated results.
- 🔧 **User-Friendly Management**:
   - **Popup Menu**: Quick overview and access.
   - **Settings Page**: Full-screen interface for managing blocklist and allowlist.

---

## **Usage**

### **Blocking Websites**

1. By default, the extension blocks common AI-related websites like ChatGPT and Bard.
2. If you visit a blocked site, a **custom block page** will appear with an option to **Allow the Site**.

### **Managing the Blocklist**

- Open the extension **Settings**:
   - Click the **AI Blocker** icon in the toolbar.
   - Select **"Manage Blocklist"** (opens a full-screen page).
- **Add Websites**:
   - Enter the domain (e.g., `example.com`) in the input field under the **Blocklist** section.
   - Click **Add**.
- **Remove Websites**:
   - Click the **Remove** button next to a website. The domain will automatically move to the allowlist.

### **Allowlist Management**

- The allowlist shows domains removed from the blocklist.
- To **move a website back to the blocklist**, click the **"Add to Blocklist"** button next to the domain in the allowlist.

### **Google Search Filtering**

- All Google search queries automatically append `-ai` to exclude AI-related results.

---

## **File Structure**
ai-blocker-extension/
│
├── manifest.json         # Extension configuration
├── content.js            # Content script for blocking AI features
├── popup.html            # Popup UI
├── popup.js              # Script for popup logic
├── options.html          # Settings page for managing lists
├── options.js            # Logic for blocklist/allowlist management
├── icon.png              # Extension icon
└── README.md             # Project documentation
---

## **Default Blocklist**

The following domains are blocked by default:

| Domain              | Description                  |
|---------------------|------------------------------|
| `openai.com`        | OpenAI services (ChatGPT)    |
| `bard.google.com`   | Google's Bard AI             |
| `gemini.google.com` | Google's Gemini AI           |
| `chatgpt.com`       | ChatGPT web services         |

---

## **How It Works**

1. **Blocking Mechanism**:
   - The extension checks the current domain against a merged list of the **default blocklist** and user-defined blocklist.
   - If matched, the page is replaced with a **custom block page**.

2. **Dynamic Updates**:
   - Adding or removing domains dynamically updates the blocklist or allowlist using `chrome.storage.sync`.

3. **Custom Block Page**:
   - Users can **"Allow This Site"**, which moves it to the allowlist.

---

## **Screenshots**

### **Popup Interface**
![Popup UI](https://raw.githubusercontent.com/seanblowers-tech/AI-Blocker/refs/heads/main/popup.png)

### **Settings Page**
![Settings UI](https://raw.githubusercontent.com/seanblowers-tech/AI-Blocker/refs/heads/main/settings.png)

### **Custom Block Page**
![Block Page](https://raw.githubusercontent.com/seanblowers-tech/AI-Blocker/refs/heads/main/blocked.png)

---

## **Contributing**

Contributions are welcome!  
To contribute:

1. Fork the repository.
2. Create a feature branch:
3. Commit your changes:
4. Push to the branch:
5. Open a pull request.

---

## **License**

This project is licensed under the **MIT License**.

---

## **Support**

For questions, suggestions, or issues, open an issue on the repository or contact the project maintainer.

---

## **Beta Installation Instructions**

This extension is currently in beta. To use it, you must enable **Developer Mode** in Chrome and load the unpacked extension manually. Follow these steps:

1. **Unzip the Extension Folder**  
   - Download the extension's `.zip` file.
   - Extract the contents to a folder on your computer.

2. **Enable Developer Mode**  
   - Open Chrome and navigate to `chrome://extensions/`.
   - Toggle the **Developer Mode** switch in the top-right corner.

3. **Load the Unpacked Extension**  
   - Click on the **"Load unpacked"** button.
   - Select the folder where you unzipped the extension.

4. **Verify Installation**  
   - The **AI Blocker** icon should now appear in the Chrome toolbar. You can click it to access the popup.

This process is required only while the extension is in beta. Once it's published to the Chrome Web Store, installation will be seamless.

---

**Start blocking unwanted AI features today with AI Blocker! 🚀**
