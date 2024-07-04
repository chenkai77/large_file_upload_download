import "./index.scss";
import axios from "axios";

export default function FileUpload() {
  function fileSlice(file: File) {
    const singleSize = 1024 * 1024; // 设置分片大小为 1MB
    let startPos = 0;
    const sliceArr = [];
    while (startPos < file.size) {
      const sliceFile = file.slice(startPos, startPos + singleSize);
      sliceArr.push(sliceFile);
      startPos += singleSize;
    }
    return sliceArr;
  }

  function fileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileSliceArr = fileSlice(file);
      const fetchList: Promise<undefined>[] = [];
      fileSliceArr.forEach((fileFragments, index) => {
        const formData = new FormData();
        formData.set("file", fileFragments);
        formData.set("name", file.name);
        formData.set("index", index + "");
        fetchList.push(
          axios({
            method: "POST",
            url: "http://localhost:3000/upload",
            data: formData,
          })
        );
      });
      Promise.all(fetchList).then(() => {
        axios({
          method: "POST",
          url: "http://localhost:3000/stream_merge",
          data: {
            name: file.name,
          },
        });
      });
    }
  }

  return (
    <div className="file-upload">
      <input
        type="file"
        className="upload-input"
        onChange={(event) => fileChange(event)}
      />
    </div>
  );
}
