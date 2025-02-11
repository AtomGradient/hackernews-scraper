<div align="center">

# 📰 HackerNews CLI

A powerful command-line interface for browsing [Hacker News](https://news.ycombinator.com) - fetch top stories, newest posts, and comments with ease.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![npm version](https://badge.fury.io/js/hackernews-scraper-cli.svg)](https://www.npmjs.com/package/hackernews-scraper-cli)

</div>

## ✨ Features

- 🔥 **Top Stories** - Browse the most popular discussions on Hacker News
- 🆕 **Newest Stories** - Stay up-to-date with fresh content
- 💬 **Comments** - Dive deep into discussions
- 📄 **Raw Content** - Extract article content for further processing
- ⚡ **Lightning Fast** - Powered by Puppeteer for efficient scraping
- 📱 **Pagination Support** - Navigate through content seamlessly

## 🚀 Installation

### Via NPM
```bash
npm install -g hackernews-scraper-cli
```

### From Source
```bash
# Clone the repository
git clone https://github.com/AtomGradient/hackernews-scraper
cd hackernews-scraper

# Install dependencies
npm install

# Link globally
npm link
```

## 📖 Usage Guide

### Top Stories
```bash
# Fetch first page
hackernews top

# Fetch specific page (e.g., page 2)
hackernews top --page 2
```

### Newest Stories
```bash
# Fetch first page
hackernews newest

# Navigate to next page using token
hackernews newest --nextPage "newest?next=42972516&n=31" --index 2
```

### Story Comments
```bash
# Fetch comments for a specific story
hackernews comments --commentsHref "item?id=42971811"
```

### Raw Content
```bash
# Fetch article content
hackernews raw https://arxiv.org/abs/2502.06788

# Use system browser (macOS only)
hackernews raw https://example.com --default-browser
```

## 📋 Command Reference

| Command | Description | Options |
|---------|-------------|----------|
| `top` | Fetch top stories | `--page <number>` |
| `newest` | Fetch newest stories | `--nextPage <token>`, `--index <number>` |
| `comments` | Fetch story comments | `--commentsHref <href>` |
| `raw` | Extract article content | `--default-browser` (macOS only) |

## 🔍 Example Responses

### Newest Stories Response
```json
{
  "articles": [
    {
      "title": "New AI breakthrough",
      "link": "https://example.com",
      "points": 120,
      "comments": 45,
      "commentsHref": "https://news.ycombinator.com/item?id=42971811"
    }
  ],
  "nextPage": "newest?next=42972516&n=31",
  "index": 2
}
```

### Comments Response
```json
[
  {
    "author": "alice123",
    "time": "2 hours ago",
    "commentText": "This is a fascinating development in AI!",
    "replies": [
      {
        "author": "bob456",
        "time": "1 hour ago",
        "commentText": "I agree! Have you read the paper?",
        "replies": []
      }
    ]
  }
]
```

## 🛠️ Development

Want to contribute? Great! Here's how to modify the CLI:

1. Modify `src/HackNewsService.js` for scraping logic
2. Update `hackernews.js` for CLI commands
3. Re-link the CLI:
   ```bash
   npm unlink -g
   npm link
   ```

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  
### Star ⭐ this repository if you find it helpful!

Need help? [Open an issue](https://github.com/AtomGradient/hackernews-scraper/issues) 🤝

</div>