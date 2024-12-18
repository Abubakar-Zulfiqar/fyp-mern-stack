import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    dateOfBirth: "",
    age: "",
    academicStatus: "",
    email: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProfile(response.data);
      } catch (error) {
        toast.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = { ...profile };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Profile updated successfully");
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={profile.dateOfBirth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Academic Status
            </label>
            <input
              type="text"
              name="academicStatus"
              value={profile.academicStatus}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500"
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
