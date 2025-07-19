import pic from "../../assets/pic.jpg";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  const categories = [
    { name: "Fashion And Apparel", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752938132/xzbafunsvzu5rzcp17a3.jpg" },
    { name: "Hair And Beauty Products", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752938099/gedxx26dldgavk3dg7ri.jpg" },
    { name: "Bags And Accessories", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752938053/h78im7vvzfnejekpq0ea.jpg"},
    { name: "Baked Goods And Snacks", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752937997/calg8o5jcthiagtmcg0u.jpg" },
    { name: "Electronics And Gadgets", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752937903/bpvuraqrkngywtkiqpra.jpg" },
    { name: "Foodstuff And Provisions", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752937842/u9ta2u0jbmzt0i3kozpj.jpg" },
    { name: "Health and Personal Care Products", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752927083/eriqxj0iwoc9q5cth9ik.jpg" },
    { name: "Others", image: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1752926967/tqibon9nib934ivygibt.jpg" },
  ];

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/category?category=${encodeURIComponent(category.name)}`}
            className="group transition-transform duration-200 transform hover:scale-[1.02]"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-85 object-cover"
              />
              <div className="p-3 text-center">
                <h3 className="text-md font-semibold text-gray-700 group-hover:text-black truncate">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
