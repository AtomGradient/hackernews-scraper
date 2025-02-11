---

# HackerNews CLI

A simple Node.js command-line tool to scrape top and newest stories from [Hacker News](https://news.ycombinator.com).

## Features

- 📈 Fetch **Top Stories** from Hacker News.
- 🆕 Retrieve the **Newest Stories** with manual pagination support.
- ⚡ Fast scraping using Puppeteer.

---

## Install

```bash
npm i -g  hackernews-scraper-cli
```


## Install with source

1. Clone the repository:

   ```bash
   git clone https://github.com/AtomGradient/hackernews-scraper
   cd hackernews-scraper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Link the CLI globally:

   ```bash
   npm link
   ```

---

## Usage

### 1. **Fetch Top Stories**

Fetch the first page of top stories:

```bash
hackernews top
```

Fetch a specific page (e.g., page 2):

```bash
hackernews top --page 2
```

---

### 2. **Fetch Newest Stories**

Fetch the first page of newest stories:

```bash
hackernews newest
```

**Example Output:**

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

---


### 3. **Fetch Comments for a Story**

Retrieve comments for a specific Hacker News story.

```bash
hackernews comments --commentsHref <href>
```

**Options:**

- `--commentsHref <href>`: The relative URL for the comments page (e.g., `item?id=42971811`). You can get this from the output of the `top` or `newest` commands.

**Example:**

```bash
hackernews comments --commentsHref "item?id=42971811"
```

**Example Output:**

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
        "commentText": "I agree! Have you read the paper? (https://example.com/paper)",
        "replies": []
      }
    ]
  },
  {
    "author": "charlie789",
    "time": "30 minutes ago",
    "commentText": "I think there are still some ethical concerns to address.",
    "replies": []
  }
]
```

---


### 4. **Fetch URL Raw Content**

Fetch the given url's web raw content, for example, you can use it for LLM summarizing:

```bash
hackernews raw https://arxiv.org/abs/2502.06788
```

**Example Output:**

```json
{
  "content": "Skip to main content\nWe gratefully acknowledge support from the Simons Foundation, member institutions, and all contributors.\nDonate\n>\ncs\n>\narXiv:2502.06788\n\nHelp | Advanced Search\n\nAll fields\nTitle\nAuthor\nAbstract\nComments\nJournal reference\nACM classification\nMSC classification\nReport number\narXiv identifier\nDOI\nORCID\narXiv author ID\nHelp pages\nFull text\nSearch\nComputer Science > Computer Vision and Pattern Recognition\n[Submitted on 10 Feb 2025]\nEVEv2: Improved Baselines for Encoder-Free Vision-Language Models\nHaiwen Diao, Xiaotong Li, Yufeng Cui, Yueze Wang, Haoge Deng, Ting Pan, Wenxuan Wang, Huchuan Lu, Xinlong Wang\nExisting encoder-free vision-language models (VLMs) are rapidly narrowing the performance gap with their encoder-based counterparts, highlighting the promising potential for unified multimodal systems with structural simplicity and efficient deployment. We systematically clarify the performance gap between VLMs using pre-trained vision encoders, discrete tokenizers, and minimalist visual layers from scratch, deeply excavating the under-examined characteristics of encoder-free VLMs. We develop efficient strategies for encoder-free VLMs that rival mainstream encoder-based ones. After an in-depth investigation, we launch EVEv2.0, a new and improved family of encoder-free VLMs. We show that: (i) Properly decomposing and hierarchically associating vision and language within a unified model reduces interference between modalities. (ii) A well-designed training strategy enables effective optimization for encoder-free VLMs. Through extensive evaluation, our EVEv2.0 represents a thorough study for developing a decoder-only architecture across modalities, demonstrating superior data efficiency and strong vision-reasoning capability. Code is publicly available at: this https URL.\nComments:\t19 pages, 9 figures\nSubjects:\tComputer Vision and Pattern Recognition (cs.CV); Artificial Intelligence (cs.AI)\nCite as:\tarXiv:2502.06788 [cs.CV]\n \t(or arXiv:2502.06788v1 [cs.CV] for this version)\n \t\nhttps://doi.org/10.48550/arXiv.2502.06788\nFocus to learn more\nSubmission history\nFrom: Haiwen Diao [view email]\n[v1] Mon, 10 Feb 2025 18:59:58 UTC (2,441 KB)\n\nAccess Paper:\nView PDF\nHTML (experimental)\nTeX Source\nOther Formats\nview license\nCurrent browse context:\ncs.CV\n< prev   |   next >\n\nnew | recent | 2025-02\nChange to browse by:\ncs\ncs.AI\n\nReferences & Citations\nNASA ADS\nGoogle Scholar\nSemantic Scholar\nExport BibTeX Citation\nBookmark\n \nBibliographic Tools\nBibliographic and Citation Tools\nBibliographic Explorer Toggle\nBibliographic Explorer (What is the Explorer?)\nConnected Papers Toggle\nConnected Papers (What is Connected Papers?)\nLitmaps Toggle\nLitmaps (What is Litmaps?)\nscite.ai Toggle\nscite Smart Citations (What are Smart Citations?)\nCode, Data, Media\nDemos\nRelated Papers\nAbout arXivLabs\nWhich authors of this paper are endorsers? | Disable MathJax (What is MathJax?)\nAbout\nHelp\nContact\nSubscribe\nCopyright\nPrivacy Policy\nWeb Accessibility Assistance\n\narXiv Operational Status \nGet status notifications via email or slack",
  "keywords": "",
  "summary": "",
  "top_image": ""
}
```
you can alse use the `--default-browser` flag to use your own web browser, cause some websites do not support puppeteer's web browser.
```bash
# currently, `--default-browser` only works on macOS.
hackernews raw https://conhecimentohoje.blogs.sapo.pt/trumps-bold-move-a-bitcoin-etf-that-98774 --default-browser
```
---


### Pagination with Newest Stories

After fetching the first page, use the `nextPage` token from the output to fetch subsequent pages.

#### Step 1: Fetch the First Page

```bash
hackernews newest
```

#### Step 2: Use `nextPage` Token to Fetch the Next Page

```bash
hackernews newest --nextPage "newest?next=42972516&n=31" --index 2
```

Repeat this process using the new `nextPage` token returned in each response.

---

## Options

| Command               | Description                                      |
|-----------------------|--------------------------------------------------|
| `hackernews top`      | Fetch top stories from Hacker News               |
| `--page <number>`     | (Optional) Specify the page number for top stories|
| `hackernews newest`   | Fetch newest stories from Hacker News            |
| `--nextPage <token>`  | (Optional) Use the token to fetch next newest page|
| `--index <number>`    | (Optional) Specify the index of the page(NO NEED) |
| `hackernews comments` | Fetch comments of some  Hacker News item          |
| `--commentsHref <href>`|Specify the comments tag of some Hacker News item|

---

## Example

Fetch the first 3 pages of newest stories manually:

```bash
hackernews newest
# Use nextPage from output
hackernews newest --nextPage "newest?next=42972516&n=31" --index 2
# Use nextPage from output
hackernews newest --nextPage "newest?next=42973000&n=31" --index 3
```

---

## Development

To modify or add new features:

1. Edit `src/HackNewsService.js` for scraping logic.
2. Update `index.js` for CLI commands.

After making changes, re-link the CLI:

```bash
npm unlink -g
npm link
```

---

## License

This project is licensed under the MIT License.

---

Let me know if you need any adjustments! 🚀