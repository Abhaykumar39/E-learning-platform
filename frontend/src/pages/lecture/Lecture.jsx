import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [watchedLectures, setWatchedLectures] = useState([]);

  useEffect(() => {
    if (
      user &&
      user.role !== "admin" &&
      !user.subscription?.includes(params.id)
    ) {
      navigate("/");
    }
  }, [user, params.id, navigate]);

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    try {
      setLecLoading(true);
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const markAsWatched = (id) => {
    if (!watchedLectures.includes(id)) {
      setWatchedLectures([...watchedLectures, id]);
    }
  };

  useEffect(() => {
    fetchLectures();
    const saved = JSON.parse(localStorage.getItem(`watched-${params.id}`)) || [];
    setWatchedLectures(saved);
  }, [params.id]);

  useEffect(() => {
    localStorage.setItem(`watched-${params.id}`, JSON.stringify(watchedLectures));
  }, [watchedLectures, params.id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="lecture-page">
          {user && user.role !== "admin" && (
            <div className="progress">
              Lecture completed - {watchedLectures.length} out of {lectures.length}
              <br />
              <progress value={watchedLectures.length} max={lectures.length}></progress>
              {Math.floor((watchedLectures.length / lectures.length) * 100)} %
            </div>
          )}
          <div className="left">
            {lecLoading ? (
              <Loading />
            ) : lecture.video ? (
              <>
                <video
                  src={`${server}/${lecture.video}`}
                  width="100%"
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                  onEnded={() => markAsWatched(lecture._id)}
                ></video>
                <h1>{lecture.title}</h1>
                <h3>{lecture.description}</h3>
              </>
            ) : (
              <h1>Please Select a Lecture</h1>
            )}
          </div>
          <div className="right">
            {user && user.role === "admin" && (
              <button className="common-btn" onClick={() => setShow(!show)}>
                {show ? "Close" : "Add Lecture +"}
              </button>
            )}

            {show && (
              <div className="lecture-form">
                <h2>Add lecture</h2>
                <form onSubmit={submitHandler}>
                  <label>Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <label>Description</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <input
                    type="file"
                    placeholder="choose video"
                    required
                    onChange={changeVideoHandler}
                  />

                  {videoPrev && (
                    <video src={videoPrev} width={300} controls></video>
                  )}

                  <button
                    disabled={btnLoading}
                    type="submit"
                    className="common-btn"
                  >
                    {btnLoading ? "Please Wait..." : "Add"}
                  </button>
                </form>
              </div>
            )}

            {lectures.length > 0 ? (
              lectures.map((e, i) => (
                <div
                  onClick={() => fetchLecture(e._id)}
                  key={i}
                  className={`lecture-number ${
                    lecture._id === e._id ? "active" : ""
                  }`}
                >
                  {i + 1}. {e.title}
                  {user && user.role !== "admin" && watchedLectures.includes(e._id) && (
                    <span className="tick">✔</span>
                  )}
                  {user && user.role === "admin" && (
                    <button
                      className="common-btn"
                      style={{ backgroundColor: "red" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteHandler(e._id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No lecture Yet...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Lecture;
