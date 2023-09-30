import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  setActiveDate,
  setActiveWeek,
} from "../../../redux/slices/userSlice";
import moment from "moment";
import Date from "../../../utils/skeletons/Date";

const HorizontalCalendar = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeDate = useSelector((state) => getUserData(state, "activeDate"));
  const activeWeek = useSelector((state) => getUserData(state, "activeWeek"));
  const dispatch = useDispatch();

  const updateDates = () => {
    const lastYear = moment(activeDate).clone().subtract(1, "year");
    const daysDiff = moment(activeDate).diff(lastYear, "days");

    const dateArray = [];
    for (let i = daysDiff; i >= 0; i--) {
      const day = lastYear.clone().add(i, "days");
      if (day.day() !== 0) {
        dateArray.push(day);
      }
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

  const renderWeekLabel = (weekStartDate, weekEndDate, i) => {
    const weekLabel = `Week ${weekStartDate.format("DD")}-${weekEndDate.format(
      "DD"
    )}`;
    const isSelected = weekStartDate.format("YYYY-MM-DD") === activeWeek;
    return (
      <Stack
        key={`${weekLabel}_${i}`}
        sx={{
          padding: "5px 18px",
          borderRadius: "10px",
          border: isSelected ? "2px solid #235ff8" : "none",
          cursor: "pointer",
        }}
        onClick={() =>
          dispatch(setActiveWeek(weekStartDate.format("YYYY-MM-DD")))
        }
        justifyContent="center"
        alignItems="center"
        spacing={0}
      >
        <Typography variant="overline" sx={{ color: "whitesmoke" }}>
          {weekLabel}
        </Typography>
      </Stack>
    );
  };

  const renderCalendar = () => {
    const calendarItems = [];
    let currentWeekStartDate = null;
    let currentWeekEndDate = null;

    dates.forEach((date, index) => {
      const isSelected = date.isSame(activeDate, "day");
      if (!currentWeekStartDate || date.day() === 1) {
        currentWeekStartDate = date.clone();
        currentWeekEndDate = date.clone().add(5, "days");
      }
      if (date.day() === 6 && !date.isSame(moment(), "day")) {
        calendarItems.push(
          renderWeekLabel(currentWeekStartDate, currentWeekEndDate, index)
        );
        currentWeekStartDate = null;
        currentWeekEndDate = null;
      }

      calendarItems.push(
        <Stack
          key={index}
          sx={{
            padding: "5px 18px",
            borderRadius: "10px",
            border: isSelected ? "2px solid #235ff8" : "none",
            cursor: "pointer",
          }}
          onClick={() => dispatch(setActiveDate(date.format("YYYY-MM-DD")))}
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
    return calendarItems;
  };
  const filledArray = new Array(30).fill(0).map((_, index) => index + 1);

  return (
    <Box className="calendar-container hide-scrollbar-x">
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
