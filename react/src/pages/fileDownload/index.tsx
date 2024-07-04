import "./index.scss";
import axios from "axios";

export default function FileDownload() {
  function fileDownload() {
    const singleSize = 1024 * 1024; // 设置分片大小为 1MB
    axios({
      method: "GET",
      url: "http://localhost:3000/file_size",
    }).then((res) => {
      if (res.data) {
        const fileSize = res.data.size;
        const fileName = res.data.fileName;
        let startPos = 0;
        const fetchList: Promise<Blob>[] = [];
        while (startPos < fileSize) {
          fetchList.push(
            new Promise((resolve) => {
              axios({
                method: "GET",
                url: "http://localhost:3000/file_chunk",
                params: {
                  start: startPos,
                  end: startPos + singleSize,
                },
                responseType: "blob",
              }).then((res) => {
                resolve(res.data);
              });
            })
          );
          startPos = startPos + singleSize + 1;
        }
        Promise.all(fetchList).then((res) => {
          const mergedBlob = new Blob(res);
          const downloadUrl = window.URL.createObjectURL(mergedBlob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", fileName);
          link.click();
          window.URL.revokeObjectURL(downloadUrl);
        });
      }
    });
  }

  return (
    <div className="file-download">
      <button onClick={fileDownload}>下载</button>
    </div>
  );
}
