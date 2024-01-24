import { useState } from "react";
import { Grid, Sheet, Textarea } from "@mui/joy";
import { MarkdownClient } from "./markdown-client";
import type { FunctionComponent } from "react";

export type MarkdownClientDemoProps = {
  initialMarkdown?: string;
};

const demoText = `# Markdown Playground

**Welcome** to the *Markdown Playground* where you can explore the power of markdown in just _six lines_!

1. Create **bold** and *italic* text effortlessly.
2. Use [links](https://www.example.com) to navigate to your favorite websites.
3. Showcase code snippets using inline \`code\` or code blocks:

\`\`\`python
  def greet(name):
    return f"Hello, {name}!"
\`\`\`
`;

export const MarkdownClientDemo: FunctionComponent<MarkdownClientDemoProps> = ({
  initialMarkdown = demoText,
}) => {
  const [markdown, setMarkdown] = useState(initialMarkdown ?? "");

  return (
    <Grid container spacing={1} sx={{ height: 400, my: 2 }}>
      <Grid xs={12} sm={6}>
        <Textarea
          minRows={16}
          maxRows={16}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <Sheet sx={{ height: "400px", p: 1, overflowY: "auto" }}>
          <MarkdownClient>{markdown}</MarkdownClient>
        </Sheet>
      </Grid>
    </Grid>
  );
};
