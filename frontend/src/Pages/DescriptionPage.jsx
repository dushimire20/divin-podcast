import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DescriptionPage = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState();
  useEffect(() => {
    const fetch = async () => {
      const res = await axios(
        `http://localhost:8080/api/v1/get-podcast/${id}`,
        {
          withCredentials: true,
        }
      );
      // console.log(res);
      // console.log(res.data.data);
      setPodcast(res.data.data);
    };
    fetch();
  }, []);
  return (
    <div className="px-4 py-4 lg:px-12 h-auto flex flex-col md:flex-row items-start justify-center gap-4">
      {podcast && (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start w-full p-4 bg-white rounded-lg shadow-md">
            <div className="w-full md:w-2/5 flex justify-center md:justify-start">
              <img
                src={`http://localhost:7000/${podcast.frontImage}`}
                className="rounded-lg w-full h-auto max-h-[50vh] md:max-h-[60vh] object-cover"
              />
            </div>
            <div className="w-full md:w-3/5 mt-4 md:mt-0 md:ml-6">
              <h1 className="text-2xl md:text-4xl text-slate-700 font-bold">
                {podcast.title}
              </h1>
              <p className="text-base md:text-lg text-slate-500 mt-2">
                {podcast.description}
              </p>
              <div className="mt-4 bg-blue-100 text-blue-800 border border-blue-800 rounded-full px-4 py-2  text-center w-fit">
                {podcast.category.categoryName}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DescriptionPage;
