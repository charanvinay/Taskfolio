import { Box, Grid, Hidden, Stack, Typography } from "@mui/material";
import React from "react";
import { CAROUSEL_ITEMS, COLORS } from "../../../utils/constants";

import dotsb from "../../../Assets/dotsb.png";
import dotscross from "../../../Assets/dotscross.png";
import login from "../../../Assets/login.png";
import { Carousel } from "react-responsive-carousel";

const LeftBanners = () => {
  return (
    <Hidden smDown>
      <Grid
        item
        md={6}
        lg={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          backgroundColor: COLORS["PRIMARY"],
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            position: "absolute",
            top: -25,
            right: -120,
            opacity: 0.5,
            filter: "invert(100%)",
          }}
        >
          <img src={dotscross} alt={"dotswhite"} width="400px" />
        </Box>
        <Carousel
          autoPlay
          emulateTouch
          infiniteLoop
          showArrows={false}
          showThumbs={false}
          showStatus={false}
        >
          {CAROUSEL_ITEMS.map((slide) => {
            const { id, alt, text, imageUrl } = slide;
            return (
              <Stack
                spacing={2}
                justifyContent="center"
                alignItems="center"
                key={id}
                sx={{
                  width: "100%",
                  height: "100dvh",
                }}
              >
                <Box sx={{ minWidth: "50%",maxWidth: "50%" }}>
                  <img
                    src={imageUrl}
                    alt={alt}
                    style={{ objectFit: "contain", width: "100%" }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "white",
                  }}
                >
                  {text}
                </Typography>
              </Stack>
            );
          })}
        </Carousel>
        <Box
          sx={{
            overflow: "hidden",
            position: "absolute",
            bottom: -70,
            left: -10,
            opacity: 0.5,
            filter: "invert(100%)",
          }}
        >
          <img src={dotsb} alt={"dotswhite"} width="200px" />
        </Box>
      </Grid>
    </Hidden>
  );
};

export default LeftBanners;
