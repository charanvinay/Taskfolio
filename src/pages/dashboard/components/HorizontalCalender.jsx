import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, setActiveDate } from "../../../redux/slices/userSlice";
import moment from "moment";
import Date from "../../../utils/skeletons/Date";

const HorizontalCalendar = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeDate = useSelector((state) => getUserData(state, "activeDate"));
  const dispatch = useDispatch();

  const updateDates = () => {
    const lastYear = moment(activeDate).clone().subtract(1, "year");
    const daysDiff = moment(activeDate).diff(lastYear, "days");

    const dateArray = [];
    for (let i = daysDiff; i >= 0; i--) {
      const day = lastYear.clone().add(i, "days");
      dateArray.push(day);
    }
    setDates(dateArray);
    setLoading(false);
  };

  useEffect(() => {
    // Delay the initial update by 10 seconds
    const initialUpdateDelay = setTimeout(() => {
      updateDates(); // Initial update
    }, 1000);

    return () => {
      clearTimeout(initialUpdateDelay); // Clear the initial update timeout on unmount
    };
  }, []);

  const renderCalendar = () => {
    return dates.map((date, index) => {
      const isSelected = date.isSame(activeDate, "day");
      return (
        <Stack
          key={index}
          sx={{
            padding: "5px 18px",
            borderRadius: "10px",
            border: isSelected && "2px solid #235ff8",
            cursor: "pointer",
          }}
          onClick={() =>
            dispatch(setActiveDate(moment(date).format("YYYY-MM-DD")))
          }
          justifyContent="center"
          alignItems="center"
          spacing={0}
        >
          <Typography
            variant="overline"
            sx={{ color: isSelected ? "whitesmoke" : "#7197f7" }}
          >
            {date.format("MMM")}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: isSelected ? "white" : "#7197f7",
              fontWeight: "500",
              fontSize: "20px",
              lineHeight: 1.2,
            }}
          >
            {date.format("DD")}
          </Typography>
          <Typography
            variant="overline"
            sx={{ color: isSelected ? "whitesmoke" : "#7197f7" }}
          >
            {date.format("ddd")}
          </Typography>
        </Stack>
      );
    });
  };
  const filledArray = new Array(30).fill(0).map((_, index) => index + 1);

  return (
    <Box className="calendar-container">
      {loading ? (
        filledArray.map((_, i) => {
          return (
            <span key={i}>
              <Date />
            </span>
          );
        })
      ) : (
        <>{renderCalendar()}</>
      )}
    </Box>
  );
};

export default HorizontalCalendar;
