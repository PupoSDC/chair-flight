import { useState } from "react";
import { Button } from "@mui/joy";
import { ImageViewer } from "./image-viewer";
import type { DrawingPoints } from "./image-viewer";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof ImageViewer>;

export const Playground: Story = {
  args: {
    open: false,
    imgSrc: "image 1",
  },
  argTypes: {
    imgSrc: {
      defaultValue: "image 1",
      options: ["image 1", "image 2", "image 3", "image 4"],
      mapping: {
        "image 1":
          "http://localhost:4200/content/annex/facd988e59bbec4bfd2c2ab4427a45ed.jpg",
        "image 2":
          "http://localhost:4200/content/annex/ede35b3c1eb70d78a1ed95c8d1410148.jpg",
        "image 3":
          "http://localhost:4200/content/annex/eb38917314ded07e0c84adfe1a2c84c1.jpg",
        "image 4":
          "http://localhost:4200/content/annex/e994bfeb66acb1a4be2896b12a0c1568.jpg",
      },
      control: {
        type: "select",
      },
    },
  },
  render: function ImageViewerWithState(args) {
    const [open, setOpen] = useState(false);
    const [drawings, setDrawings] = useState<DrawingPoints[]>([]);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Image</Button>
        <ImageViewer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          drawings={drawings}
          onDrawingsChanged={(newDrawings) => {
            setDrawings(newDrawings);
            args.onDrawingsChanged?.(newDrawings);
          }}
          onUndo={() => {
            setDrawings(drawings.slice(0, drawings.length - 1));
            args.onUndo?.();
          }}
          onReset={() => {
            setDrawings([]);
            args.onReset?.();
          }}
        />
      </>
    );
  },
};

const meta: Meta<typeof ImageViewer> = {
  title: "Components/ImageViewer",
  component: ImageViewer,
  tags: ["autodocs"],
};

export default meta;
