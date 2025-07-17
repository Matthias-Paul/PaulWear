import pic from "../../assets/pic.jpg";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
    const categories = [
      { name: "Fashion And Apparel", image: pic },
      { name: "Hair And Beauty Products", image: pic },
      { name: "Bags And Accessories", image: pic },
      { name: "Baked Goods And Snacks", image: pic },
      { name: "Electronics And Gadgets", image: pic },
      { name: "Foodstuff And Provisions", image: pic },
      {name: "Health and Personal Care Products", image: pic},
      { name: "Others", image: pic },
    ];




  return (
    <div>
      <div className="grid px-1 grid-cols-1 pt-7 md:gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {categories?.map((category) => (
          <div key={category?.name} className="p-2 block">
            <Link to={`/category?category=${encodeURIComponent(category?.name)}`}>
              <div className="w-full border-[0.3px] border-gray-400 rounded-md p-2 mb-4">
                <img
                  className="object-cover mb-3 w-full flex-shrink-0 h-85 sm:h-70"
                  src={category?.image}
                  alt={category?.name}
                />
                <div className="text-lg text-center mb-1 font-medium truncate">
                  {category?.name}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

