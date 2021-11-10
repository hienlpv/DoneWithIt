const trans = [
  { from: "is a required field", to: "là bắt buộc!" },
  {
    from: "must be a valid email",
    to: "chưa đúng định dạng!",
  },
  {
    from: "must be at least 4 characters",
    to: "không được ít hơn 4 ký tự!",
  },
];

export const yupVN = (text) => {
  let res = text.toString();
  trans.forEach((i) => {
    res = res.replace(i.from, i.to);
  });
  return res;
};
