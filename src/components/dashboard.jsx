import { Avatar } from "antd";
import {
  SunOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import UserTable from "./userTable";
import Card from "./Card";
import { card_data } from "../data/card-data";

const iconMap = {
  ClockCircleOutlined,
  UserOutlined,
  PercentageOutlined,
};

const Dashboard = () => {
  return (
    <div className="md:ml-60 ml-20 flex flex-col gap-6 p-4 max-w-full rounded-lg bg-white h-100vh">
      {/* Header */}
      <div className="flex justify-between items-center px-5 ">
        <h1 className="font-semibold text-2xl text-slate-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div>
            <SunOutlined />
          </div>
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
          />
          <div>
            <p className="text-slate-900 font-medium">sanjeevkumar</p>
            <p className="text-slate-400 text-sm">Engineer</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {card_data.map((data) => {
          const IconComponent = iconMap[data.icon];
          return (
            <Card
              key={data.id}
              title={data.title}
              value={data.value}
              percentage={data.percentage}
              IconComponent={IconComponent}
            />
          );
        })}
        {/* Quick Actions */}
        <div className=" text-white text-sm flex flex-col justify-between gap-2 w-full h-[150px] rounded-lg border p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 bg-slate-950">
          <div className="text-gray-500">
            <p>Quick Actions</p>
          </div>
          <div className="flex justify-between hover:bg-gray-700  p-2 rounded-md">
            <p> Add New content</p>
            <p>
              <ArrowRightOutlined />
            </p>
          </div>
          <div className="flex justify-between  hover:bg-gray-700 p-2 rounded-md">
            <p>Update clone profile</p>
            <p>
              <ArrowRightOutlined />
            </p>
          </div>
        </div>
      </div>

      {/* User data section */}
      <div className="flex flex-col  border-2 rounded-lg h-full sm:hidden md:flex">
        <div className="flex  justify-between">
          <div className="flex flex-1 p-2 items-center">
            <p className="text-slate-950 font-semibold">
              Top user Interactions
            </p>
          </div>
          <div className="w-px bg-slate-400"></div>
          <div className="flex flex-1 p-2">
            <p className="text-sm text-slate-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              autem adipisci quia molestiae error modi voluptatibus deserunt
              ullam aut dolores ducimus quas ipsam harum incidunt
            </p>
          </div>
        </div>
        {/* User Table */}
        <UserTable />
      </div>
    </div>
  );
};

export default Dashboard;
