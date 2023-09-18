import { Container, Grid, Hidden } from "@mui/material";
import React from "react";
import Tasks from "../../tasks";
import Groups from "./Groups";
import Members from "./Members";

const Cards = () => {
  return (
    <Container sx={{ mt: "20px" }}>
      <Grid container spacing={4}>
        {/* Large devices */}
        <Hidden mdDown>
          <Grid item lg={3}>
            <Groups />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={6} lg={6}>
          <Tasks />
        </Grid>
        <Hidden mdDown>
          <Grid item lg={3}>
            <Members />
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  );
};

export default Cards;
