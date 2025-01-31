# Open SkillCapped

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
![Electron.js](https://img.shields.io/badge/Electron-191970?style=flat&logo=Electron&logoColor=white)
![GitHub Release](https://img.shields.io/github/v/release/rico-vz/open-skillcapped?include_prereleases&color=red)

</div>

Open SkillCapped is an Electron-based desktop application that allows you to watch and download SkillCapped videos without logging into your account.

## 🚀 Features

- **Stream Videos**: Watch SkillCapped videos directly in the app without logging in
- **Quality Selection**: Choose between 720p, 1080p, and 2160p resolutions
- **Video Downloads**: Download videos in your preferred quality
- **Modern Interface**: Clean, dark-themed UI with responsive design

## 📥 Installation

### Download Released Version

1. Visit the [Releases](https://github.com/rico-vz/open-skillcapped/releases) page
2. Download the appropriate version for your operating system:
   - Windows: `.exe` installer
   - macOS: `.dmg` file
   - Linux: `.deb` or `.rpm` package
3. Install the application

### Build from Source

Prerequisites:

- Node.js (LTS version recommended)
- npm or yarn
- git

```bash
# Clone the repository
git clone https://github.com/rico-vz/open-skillcapped.git
cd open-skillcapped

# Install dependencies
npm install

# Start the application in development mode
npm start

# Build the application
npm run make
```

## 📺 Usage

1. Launch the application
2. Paste a SkillCapped video URL into the input field
3. Click "Stream" to watch the video
4. (Optional) Select your preferred quality and click "Download" to save the video

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Package the app
npm run package

# Create distributable
npm run make
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/FeatureName`)
3. Commit your changes (`git commit -m 'Add some FeatureName'`)
4. Push to the branch (`git push origin feature/FeatureName`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is not affiliated with SkillCapped. It is an unofficial application and only intended to be used by SkillCapped subscribers to watch and download videos.

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/)
- [Plyr](https://plyr.io/)
- [hls.js](https://github.com/video-dev/hls.js/)
- [TailwindCSS](https://tailwindcss.com/)
