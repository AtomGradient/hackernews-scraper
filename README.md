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

### Fetch Top Stories

Fetch the first page of top stories:

```bash
hackernews top
```

Fetch a specific page (e.g., page 2):

```bash
hackernews top --page 2
```

---

### Fetch Newest Stories

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
| `--index <number>`    | (Optional) Specify the index of the page          |

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