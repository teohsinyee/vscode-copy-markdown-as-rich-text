declare module "markdown-it" {
  export interface MarkdownItOptions {
    html?: boolean;
    breaks?: boolean;
    linkify?: boolean;
    typographer?: boolean;
  }

  export default class MarkdownIt {
    constructor(options?: MarkdownItOptions);
    render(markdown: string): string;
  }
}

declare module "html-to-text" {
  export interface HtmlToTextSelectorOptions {
    selector: string;
    format?: string;
    options?: Record<string, unknown>;
  }

  export interface HtmlToTextOptions {
    selectors?: HtmlToTextSelectorOptions[];
    wordwrap?: number | false;
    preserveNewlines?: boolean;
  }

  export function htmlToText(value: string, options?: HtmlToTextOptions): string;
}
