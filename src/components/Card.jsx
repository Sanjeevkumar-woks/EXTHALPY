import { ArrowUpOutlined } from "@ant-design/icons";

const Card = ({ title, value, percentage, IconComponent }) => {
  return (
    <div className="flex flex-col justify-between gap-4 w-full h-[150px] rounded-lg border p-4 shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="bg-slate-900 rounded-full w-10 h-10 flex justify-center items-center text-white">
          <IconComponent />
        </div>
      </div>
      <div>
        <div>
          <p className="text-sm text-green-400">
            <ArrowUpOutlined />
            {percentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
