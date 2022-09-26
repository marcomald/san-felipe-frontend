/* eslint-disable react/prop-types */
import React from "react";
import { CalendarToday } from "@material-ui/icons";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("es", es);

export function CustomDatePicker(props) {
  return (
    <div className="relative">
      <div className="container-calendar-icon">
        <CalendarToday />
      </div>
      <label className="custom-label-2">{props.placeholder}</label>
      <DatePicker
        locale="es"
        selected={props.value}
        onChange={props.onChange}
        minDate={props.minDate}
        className="datePicker"
        calendarClassName="calendar-date"
      />
    </div>
  );
}
