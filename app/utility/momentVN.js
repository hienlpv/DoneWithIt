import moment from "moment";

const trans = [
  { from: "ago", to: "trước" },
  { from: "seconds", to: "giây" },
  { from: "minutes", to: "phút" },
  { from: "minute", to: "phút" },
  { from: "hours", to: "giờ" },
  { from: "hour", to: "giờ" },
  { from: "days", to: "ngày" },
  { from: "day", to: "ngày" },
  { from: "months", to: "tháng" },
  { from: "month", to: "tháng" },
  { from: "years", to: "năm" },
  { from: "year", to: "năm" },
  { from: "a few", to: "vài" },
  { from: "an", to: "một" },
  { from: "a", to: "một" },
];

export const momentVN = (date) => {
  let res = moment(date).fromNow();
  trans.forEach((i) => {
    res = res.replace(i.from, i.to);
  });
  return res;
};
