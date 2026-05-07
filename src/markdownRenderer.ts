import MarkdownIt from "markdown-it";

const markdownIt = new MarkdownIt({
  html: false,
  breaks: false,
  linkify: true,
  typographer: false
});

export function renderMarkdown(markdown: string): string {
  return markdownIt.render(markdown);
}
