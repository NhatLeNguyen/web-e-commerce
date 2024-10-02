import * as React from "react";
import { useSelector, useDispatch as useReduxDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/stores";
import {
  fetchUser,
  updateUser,
  uploadAvatar,
} from "../../../../redux/users/userThunks";
import { UserProfile } from "../../../../redux/users/userSlice";
import "./userSetting.scss";

const useDispatch = () => useReduxDispatch<AppDispatch>();

export default function UserSettings() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [userData, setUserData] = React.useState<Partial<UserProfile>>({});
  const [, setAvatarFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (accessToken && storedUser && !user) {
      const parsedUser: UserProfile = JSON.parse(storedUser);
      dispatch(fetchUser(parsedUser._id));
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      });
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      const formData = new FormData();
      formData.append("avatar", e.target.files[0]);
      if (user) {
        dispatch(uploadAvatar({ userId: user._id, formData }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      dispatch(updateUser({ userId: user._id, userData }));
    } else {
      console.error("User is not defined");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
      </div>
      <div className="settings-content">
        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <div className="avatar-container">
              <img
                src={
                  userData.avatar ||
                  "https://bootdey.com/img/Content/avatar/avatar6.png"
                }
                alt="User Avatar"
                className="avatar-img"
              />
              <div className="avatar-overlay">
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  <i className="camera-icon">📷</i>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="avatar-upload-input"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="user-info">
              <h4 className="user-name">{userData.fullName}</h4>
            </div>
          </div>
          <hr className="divider" />
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-control"
              value={userData.fullName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={userData.email || ""}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-save">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
