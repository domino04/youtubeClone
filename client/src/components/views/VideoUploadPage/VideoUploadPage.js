import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import axios from "axios";
//import { response } from "express";
import Axios from "axios";
import { useSelector } from "react-redux";
//import { use } from "../../../../../server/routes/users";

const { TextArea } = Input;
const { Title } = Typography;
const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];
const CategoryOptions = [
  { value: 0, label: "Flim & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUplaodPage(props) {
  const user = useSelector((state) => state.user);
  const [VideoTitle, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Flim & Animation");
  const [Filepath, setFilepath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (event) => {
    setTitle(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value);
  };

  const onPrivateChange = (event) => {
    setPrivate(event.currentTarget.value);
  };
  const onCategoryChange = (event) => {
    setCategory(event.currentTarget.value);
  };
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios.post(`/api/video/uploadfiles`, formData, config).then((response) => {
      console.log("저기", response);
      if (response.data.success) {
        console.log(response.data);

        let variable = {
          url: response.data.url,
          filename: response.data.fileName,
          filePath: response.data.filePath
        };
        setFilepath(response.data.filePath);

        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
          } else {
            alert("썸네일 생성에 실패했습니다.");
          }
        });
      } else {
        alert("비디오를 업로드하는데에 실패했습니다.");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filepath: Filepath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };
    console.log("var", variables)
    Axios.post("/api/video/uploadVideo", variables).then((response) => {
      console.log("ggggg", response)
      if (response.data.success) {
        message.success("성공적으로 업로드했습니다.");
        setTimeout(() => {
          props.history.push("/");
        }, 3000);
      } else {
        alert("비디오를 업로드하는데에 실패 했습니다.");
      }
    });
  };
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Upload Video </Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={10000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <Input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>

          {/* Thumbnail */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          SUBMIT
        </Button>
      </Form>
    </div>
  );
}

export default VideoUplaodPage;
