import { createBrowserRouter } from "react-router-dom";
import FileDownload from "../pages/fileDownload/index";
import FileUpload from "../pages/fileUpload/index";
import App from "../App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "file_download",
        element: <FileDownload />,
      },
      {
        path: "file_upload",
        element: <FileUpload />,
      },
    ],
  },
]);

export default routes;
