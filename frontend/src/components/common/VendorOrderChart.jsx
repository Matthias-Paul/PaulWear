
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const VendorOrderChart = ({data, isLoading}) => {

    const safeData = Array.isArray(data) ? [...data]?.reverse() : [];


  return (    
    <div className="w-full h-[350px] lg:h-[500px] mb-15 ">
        <h2 className="text-lg font-semibold mb-4">Weekly Orders</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tickLine={false} />
            <YAxis allowDecimals={false}  tickLine={false}  />
            <Tooltip /> 
            <Bar dataKey="orders" fill="#9CA3AF" barSize={40} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default VendorOrderChart;

