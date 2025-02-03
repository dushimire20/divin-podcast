
import { Link } from "react-router-dom";

const Categories = () => {
  const cat = [
    {
      name: "Comedy",
      color: "bg-blue-500",
      to: "/categories/Comedy",
      img: "https://i.pinimg.com/originals/a2/ef/f4/a2eff4bd66d77d1e38c648bd2c63dbd1.jpg", // Replace with actual image URL
    },
    {
      name: "Business",
      color: "bg-green-500",
      to: "/categories/Business",
      img: "https://img.freepik.com/free-photo/microphone-set-up-home-podcast-studio_60438-3821.jpg?t=st=1723214083~exp=1723217683~hmac=92bce466aa12bd4788e97dcde12a8d1d881970473f094ac3f857249e559a9de2&w=900", // Replace with actual image URL
    },
    {
      name: "Education",
      color: "bg-red-500",
      to: "/categories/Education",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL6Ldj4wyQwv6Yr7udYQQrcOkhI5I8yMUcvQ&s", // Replace with actual image URL
    },
    {
      name: "Sports",
      color: "bg-yellow-500",
      to: "/categories/Sports",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSilx-03CPT_0Et5T5cZTdi5CGgQEqi14bZDg&usqp=CAU", // Replace with actual image URL
    },
    {
      name: "Hobbies",
      color: "bg-pink-500",
      to: "/categories/Hobbies",
      img: "https://media.istockphoto.com/id/1409405075/vector/collection-of-3d-sport-icon-collection-isolated-on-blue-sport-and-recreation-for-healthy.jpg?s=612x612&w=is&k=20&c=u8u0_3Nuiogzvwr90J7QEPu-EK0iBEP-YHiGYhvseBY=", // Replace with actual image URL
    },
    {
      name: "Goverment",
      color: "bg-indigo-500",
      to: "/categories/Goverment",
      img: "https://media.istockphoto.com/id/1388925357/photo/the-statue-of-justice-lady-justice-or-iustitia-justitia-the-roman-goddess-of-justice.jpg?s=612x612&w=0&k=20&c=Q7lw1G9o-DoXEpUkMiK5POE01cUykjXLBUL9FLAgG98=", // Replace with actual image URL
    },
  ];

  return (
    <div className="h-screen lg:h-[78vh] mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cat.map((category, index) => (
          <Link
            key={index}
            to={category.to}
            className={`p-6 ${category.color} rounded-lg hover:scale-105 shadow-xl transition-all duration-200 h-[24vh] md:h-[40vh] lg:h-[30vh] overflow-hidden`}
          >
            <img
              src={category.img}
              alt={category.name}
              className="h-24 w-24 mx-auto rounded-full mb-4"
            />
            <h2 className="text-white text-2xl font-semibold text-center">
              {category.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
