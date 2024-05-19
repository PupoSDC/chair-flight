import { useEffect, useRef, useState } from "react";
import { default as AbcIcon } from "@mui/icons-material/Abc";
import { default as CenterFocusStrongIcon } from "@mui/icons-material/CenterFocusStrong";
import { default as CreateIcon } from "@mui/icons-material/Create";
import { default as HorizontalRuleIcon } from "@mui/icons-material/HorizontalRule";
import { default as PanToolIcon } from "@mui/icons-material/PanTool";
import { default as RestoreIcon } from "@mui/icons-material/Restore";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import {
  Button,
  List,
  ListItem,
  Modal,
  ModalClose,
  ModalDialog,
  useTheme,
} from "@mui/joy";
import useImage from "use-image";
import { useWindowSize } from "../../hooks/use-window-resize";
import { useKonvaComponents } from "./use-konva-components";
import type { BoxProps } from "@mui/joy";
import type { default as Konva } from "konva";
import type { FunctionComponent } from "react";

type Mode = "drag" | "draw" | "line" | "erase" | "text";

export type DrawingPoints = {
  points: number[];
};

export type ImageViewerProps = {
  open: boolean;
  onClose: () => void;
  imgSrc: string;
  drawings?: Array<DrawingPoints>;
  onDrawingsChanged?: (drawings: Array<DrawingPoints>) => void;
  onUndo?: () => void;
  onReset?: () => void;
} & Pick<BoxProps, "sx" | "className" | "style">;

export const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  open,
  imgSrc,
  onClose,
  drawings = [],
  onDrawingsChanged,
  onUndo,
  onReset,
  ...props
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);
  const theme = useTheme();
  const windowSize = useWindowSize();
  const [image] = useImage(imgSrc);
  const [mode, setMode] = useState<Mode>("drag");
  const [stageScale, setStageScale] = useState(1);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const [currentDrawing, setCurrentDrawing] = useState<DrawingPoints>();
  const KonvaComponents = useKonvaComponents();

  useEffect(() => {
    const imgWidth = image?.width ?? 0;
    const imgHeight = image?.height ?? 0;
    const ratio = imgWidth / imgHeight;
    const newStageWidth = Math.min(
      windowSize.width * 0.8,
      theme.breakpoints.values.lg - 7 * 8,
    );
    const newStageHeight = Math.min(
      windowSize.height * 0.8,
      theme.breakpoints.values.md,
    );
    const isOversizeWidth = imgWidth > newStageWidth;
    const isOversizeHeight = imgHeight > newStageHeight;

    let newImageWidth = 0;
    let newImageHeight = 0;
    if (isOversizeWidth && isOversizeHeight) {
      if (newStageWidth / newStageHeight > ratio) {
        newImageWidth = newStageHeight * ratio;
        newImageHeight = newStageHeight;
      } else {
        newImageWidth = newStageWidth;
        newImageHeight = newStageWidth / ratio;
      }
    } else if (isOversizeWidth) {
      newImageWidth = newStageWidth;
      newImageHeight = newStageWidth / ratio;
    } else if (isOversizeHeight) {
      newImageWidth = newStageHeight * ratio;
      newImageHeight = newStageHeight;
    } else {
      newImageWidth = imgWidth;
      newImageHeight = imgHeight;
    }

    setStageWidth(newStageWidth);
    setStageHeight(newStageHeight);
    setImageHeight(newImageHeight);
    setImageWidth(newImageWidth);
    setStageX((newStageWidth - newImageWidth) / 2);
    setStageY((newStageHeight - newImageHeight) / 2);
  }, [image, windowSize, theme]);

  if (!KonvaComponents) return null;

  const handleWheelOnDragMode = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!stage || !pointer) return;
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const x = (pointer.x - stage.x()) / oldScale;
    const y = (pointer.y - stage.y()) / oldScale;
    const newScale = Math.max(
      1.0,
      e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy,
    );
    setStageScale(newScale);
    setStageX(-(x - pointer.x / newScale) * newScale);
    setStageY(-(y - pointer.y / newScale) * newScale);
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (mode === "drag") handleWheelOnDragMode(e);
  };

  const handleMouseDownOnDrawMode = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    setCurrentDrawing({
      points: [
        (pos.x - (stageRef.current?.x() ?? 0)) / stageScale,
        (pos.y - (stageRef.current?.y() ?? 0)) / stageScale,
      ],
    });
  };

  const handleMouseDownOnLineMode = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    setCurrentDrawing({
      points: [
        (pos.x - (stageRef.current?.x() ?? 0)) / stageScale,
        (pos.y - (stageRef.current?.y() ?? 0)) / stageScale,
      ],
    });
  };

  const handleMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    if (mode === "draw") handleMouseDownOnDrawMode(e);
    if (mode === "line") handleMouseDownOnLineMode(e);
  };

  const handleMouseMoveOnDrawMode = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (currentDrawing === undefined || !pos) return;
    const newPoints = currentDrawing.points.concat([
      (pos.x - (stageRef.current?.x() ?? 0)) / stageScale,
      (pos.y - (stageRef.current?.y() ?? 0)) / stageScale,
    ]);
    setCurrentDrawing({ points: newPoints });
  };

  const handleMouseMoveOnLineMode = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!currentDrawing || !pos) return;
    const newPoints = [
      currentDrawing.points[0],
      currentDrawing.points[1],
      (pos.x - (stageRef.current?.x() ?? 0)) / stageScale,
      (pos.y - (stageRef.current?.y() ?? 0)) / stageScale,
    ];
    setCurrentDrawing({ points: newPoints });
  };

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    if (mode === "draw") handleMouseMoveOnDrawMode(e);
    if (mode === "line") handleMouseMoveOnLineMode(e);
  };

  const handleMouseUpOnDrawMode = () => {
    if (!currentDrawing) return;
    onDrawingsChanged?.(drawings.concat([currentDrawing]));
    setCurrentDrawing(undefined);
  };

  const handleMouseUpOnLineMode = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos || !currentDrawing) return;
    const newPoints = [
      currentDrawing.points[0],
      currentDrawing.points[1],
      (pos.x - (stageRef.current?.x() ?? 0)) / stageScale,
      (pos.y - (stageRef.current?.y() ?? 0)) / stageScale,
    ];
    onDrawingsChanged?.(drawings.concat([{ points: newPoints }]));
    setCurrentDrawing(undefined);
  };

  const handleMouseUp = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    if (mode === "draw") handleMouseUpOnDrawMode();
    if (mode === "line") handleMouseUpOnLineMode(e);
  };

  const handleCenter = () => {
    setStageScale(1);
    const newStageX = (stageWidth - imageWidth) / 2;
    const newStageY = (stageHeight - imageHeight) / 2;
    setStageX(newStageX);
    setStageY(newStageY);
    stageRef.current?.x(newStageX);
    stageRef.current?.y(newStageY);
  };

  const handleRestore = () => {
    handleCenter();
    onReset?.();
  };

  const handleModeSwitch = (mode: Mode) => {
    setMode(mode);
    setCurrentDrawing(undefined);
  };

  const { Stage, Layer, Image, Line } = KonvaComponents;
  return (
    <Modal open={open} onClose={onClose} {...props}>
      <ModalDialog
        sx={{
          p: { xs: 1, sm: 2 },
          pl: { xs: 0, sm: 0 },
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <ModalClose
          variant="outlined"
          sx={{
            top: "calc(-1/4 * var(--IconButton-size))",
            right: "calc(-1/4 * var(--IconButton-size))",
            boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
            borderRadius: "50%",
            bgcolor: "background.body",
            zIndex: 2,
          }}
        />
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          scaleX={stageScale}
          scaleY={stageScale}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onMousemove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
          x={stageX}
          y={stageY}
          draggable={mode === "drag"}
        >
          <Layer>
            <Image
              ref={imageRef}
              alt=""
              image={image}
              width={imageWidth}
              height={imageHeight}
            />
            {drawings.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={3}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={"source-over"}
              />
            ))}
            {currentDrawing && (
              <Line
                points={currentDrawing.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={"source-over"}
              />
            )}
          </Layer>
        </Stage>
        <List
          sx={{
            display: "flex",
            maxWidth: (t) => t.spacing(4),
            flexDirection: "column",
            mt: (t) => t.spacing(0),
            pt: 0,
            "& li": {
              display: "block",
              padding: 0,
            },
            "& button": {
              borderRadius: 0,
              width: (t) => t.spacing(4),
              height: (t) => t.spacing(4),
            },
          }}
        >
          <ListItem>
            <Button
              size="sm"
              variant={mode === "drag" ? "solid" : "plain"}
              onClick={() => handleModeSwitch("drag")}
              children={<PanToolIcon />}
            />
          </ListItem>
          <ListItem>
            <Button
              size="sm"
              variant={mode === "draw" ? "solid" : "plain"}
              onClick={() => handleModeSwitch("draw")}
              children={<CreateIcon />}
            />
          </ListItem>
          <ListItem>
            <Button
              size="sm"
              variant={mode === "line" ? "solid" : "plain"}
              onClick={() => handleModeSwitch("line")}
              children={<HorizontalRuleIcon />}
            />
          </ListItem>
          <ListItem>
            <Button
              size="sm"
              disabled
              variant={mode === "text" ? "solid" : "plain"}
              onClick={() => handleModeSwitch("text")}
              children={<AbcIcon />}
            />
          </ListItem>
          <ListItem>
            <Button
              size="sm"
              variant="plain"
              onClick={handleCenter}
              children={<CenterFocusStrongIcon />}
            />
          </ListItem>
          <ListItem>
            <Button
              size="sm"
              variant="plain"
              disabled={!onUndo && drawings.length === 0}
              onClick={onUndo}
              children={<UndoIcon />}
            />
          </ListItem>
          <ListItem>
            <Button
              size="sm"
              variant="plain"
              onClick={handleRestore}
              children={<RestoreIcon />}
            />
          </ListItem>
        </List>
      </ModalDialog>
    </Modal>
  );
};
