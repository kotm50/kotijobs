import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";

const Editor = ({ value, setValue, modules, formats }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      modules={modules}
      formats={formats}
    />
  );
};

export default Editor;
