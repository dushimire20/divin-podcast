import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const InputPodcast = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
  });

  // Handle input changes for text fields
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // Handle image selection
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFrontImage(file);
  };

  // Handle drag-and-drop events for the image
  const handleOnDragOver = (e) => e.preventDefault();
  const handleOnDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleOnDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };
  const handleOnDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    setFrontImage(file);
  };

  // Handle audio file selection
  const handleAudioFile = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };

  // Handle form submission
  const handleOnSubmit = async () => {
    if (!inputs.title || !inputs.description || !inputs.category || !frontImage || !audioFile) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("description", inputs.description);
    formData.append("category", inputs.category);
    formData.append("frontImage", frontImage);
    formData.append("audioFile", audioFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/add-podcast",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);

      // Reset form after success
      setInputs({ title: "", description: "", category: "" });
      setFrontImage(null);
      setAudioFile(null);
    } catch (error) {
      console.error("Error submitting podcast:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="my-4 px-4 lg:px-12">
      <ToastContainer />
      <h1 className="text-2xl font-semibold">Create Your Podcast</h1>

      <div className="mt-5 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Drag-and-Drop Image Upload */}
        <div className="w-full lg:w-2/6 flex items-center justify-center lg:justify-start">
          <div
            className={`h-[40vh] lg:h-[60vh] w-full flex items-center justify-center border transition-all duration-500 ${
              dragging ? "bg-blue-200" : "hover:bg-slate-200"
            }`}
            onDragEnter={handleOnDragEnter}
            onDragLeave={handleOnDragLeave}
            onDragOver={handleOnDragOver}
            onDrop={handleOnDrop}
          >
            <input
              type="file"
              accept="image/*"
              id="file"
              name="frontImage"
              className="hidden"
              onChange={handleChangeImage}
            />
            {frontImage ? (
              <img
                src={URL.createObjectURL(frontImage)}
                alt="thumbnail"
                className="h-full w-full object-cover"
              />
            ) : (
              <label
                htmlFor="file"
                className="text-xl p-4 flex items-center justify-center text-center"
              >
                Drag and drop the thumbnail or click to browse
              </label>
            )}
          </div>
        </div>

        {/* Input Fields */}
        <div className="w-full lg:w-4/6">
          <div className="flex flex-col">
            <label htmlFor="title" className="font-semibold">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter title"
              className="mt-2 px-4 py-2 border border-zinc-800 rounded outline-none"
              value={inputs.title}
              onChange={handleOnChange}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="description" className="font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
              className="mt-2 px-4 py-2 border border-zinc-800 rounded outline-none"
              rows={4}
              value={inputs.description}
              onChange={handleOnChange}
            />
          </div>

          <div className="flex flex-row mt-4">
            <div className="flex flex-col w-2/6">
              <label htmlFor="audioFile" className="font-semibold">Select Audio</label>
              <input
                type="file"
                accept=".mp3,.wav,.m4a,.ogg"
                id="audioFile"
                className="mt-2"
                onChange={handleAudioFile}
              />
            </div>
            <div className="flex flex-col w-4/6">
              <label htmlFor="category" className="font-semibold">Select Category</label>
              <select
                name="category"
                id="category"
                className="mt-2 px-4 py-2 border border-zinc-800 rounded outline-none"
                value={inputs.category}
                onChange={handleOnChange}
              >
                <option value="">Select Category</option>
                <option value="Comedy">Comedy</option>
                <option value="Sports">Sport</option>
                <option value="Government">Government</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Hobbies">Hobbies</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              className="px-4 py-2 w-full bg-zinc-800 text-white rounded"
              onClick={handleOnSubmit}
            >
              Create Podcast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPodcast;
