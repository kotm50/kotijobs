export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ size: ["", "small", "large", "huge"] }],
    [("bold", "italic", "underline", "strike", "blockquote")],
    [
      {
        color: [
          "black",
          "silver",
          "gray",
          "white",
          "maroon",
          "red",
          "purple",
          "fuchsia",
          "green",
          "lime	",
          "olive",
          "yellow",
          "navy",
          "blue",
          "teal",
          "aqua",
          "crimson",
          "darkcyan",
          "orange",
          "royalblue",
          "hotpink",
        ],
      },
    ],
    [
      {
        align: ["", "center", "right"],
      },
    ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list", // "bullet"는 list의 하위 속성이므로 필요 없음
  "indent",
  "link",
  "image",
  "color",
  "align",
  "size",
];
