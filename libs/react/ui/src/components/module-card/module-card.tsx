"use client";

import { forwardRef } from "react";
import { default as Image } from "next/image";
import { keyframes } from "@emotion/react";
import { default as CheckIcon } from "@mui/icons-material/CheckOutlined";
import { Box, Card, CardContent, CardCover, Typography } from "@mui/joy";
import type { CardProps } from "@mui/joy";

export type ModuleCardProps = {
  selected?: boolean;
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
  replace?: boolean;
} & CardProps;

export const zoomIn = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
`;

export const ModuleCard = forwardRef<HTMLDivElement, ModuleCardProps>(
  ({ selected, imgSrc, imgAlt, title, description, ...cardProps }, ref) => (
    <Card
      {...cardProps}
      ref={ref}
      color={selected ? "primary" : "neutral"}
      sx={{
        height: { xs: 120, sm: 200 },
        textDecoration: "none",
        ...(selected
          ? {
              "& img": {
                transform: "scale(1.1)",
              },
            }
          : {
              cursor: "pointer",

              "&:hover img": {
                animation: `${zoomIn} 100ms ease forwards`,
              },
            }),
        ...cardProps.sx,
      }}
    >
      <CardCover sx={{ objectFit: "cover", overflow: "hidden" }}>
        <Image src={imgSrc} alt={imgAlt} fill loading="lazy" />
      </CardCover>
      <CardCover
        sx={{
          background: `
              linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0) 200px), 
              linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 300px)
            `,
        }}
      />
      <CardContent orientation="horizontal" sx={{ mt: "auto" }}>
        <Box sx={{ mt: "auto" }}>
          <Typography
            level="body-xs"
            textColor={selected ? "primary.200" : "neutral.200"}
          >
            {title}
          </Typography>
          <Typography
            fontSize="lg"
            fontWeight="lg"
            textColor={
              selected ? "primary.plainColor" : "primary.plainDisabledColor"
            }
          >
            {description}
          </Typography>
        </Box>
        {selected && (
          <CheckIcon
            sx={{
              ml: "auto",
              color: "primary.solidColor",
              bgcolor: "primary.solidBg",
              borderRadius: "50%",
            }}
            size="lg"
          />
        )}
      </CardContent>
    </Card>
  ),
);

ModuleCard.displayName = "ModuleCard";
