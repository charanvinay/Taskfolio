import { Container, Grid, Hidden } from "@mui/material";
import React from "react";
import Tasks from "../../tasks";
import Groups from "./Groups";
import GroupsSM from "./GroupsSM";
import Members from "./Members";
import MembersSM from "./MembersSM";

const Cards = () => {
  return (
    <Container sx={{ mt: "20px" }}>
      <Grid container spacing={{lg: 4, md:2, sm:2, xs:2}} rowSpacing={0} rowGap={0}>
        {/* Large devices */}
        <Hidden mdDown>
          <Grid item lg={3}>
            <Groups />
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Grid item xs={13} md={6}>
            <GroupsSM />
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Grid item xs={13} md={6}>
            <MembersSM />
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
