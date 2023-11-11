import { useState } from "react";
import { Grid, Sheet, Textarea } from "@mui/joy";
import { MarkdownClient } from "./markdown-client";
import type { FunctionComponent } from "react";

export type MarkdownClientDemoProps = {
  initialMarkdown?: string;
};

export const MarkdownClientDemo: FunctionComponent<MarkdownClientDemoProps> = ({
  initialMarkdown,
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
