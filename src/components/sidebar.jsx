import {
  AppstoreOutlined,
  LogoutOutlined,
  MinusCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const sidebarNavItems = [
  { id: 1, label: "Dashboard", icon: "AppstoreOutlined", link: "/dashboard" },
  { id: 2, label: "Configure Clone", icon: "MinusCircleOutlined", link: "#" },
  { id: 3, label: "Settings", icon: "SettingOutlined", link: "#" },
];
const iconMap = {
  AppstoreOutlined,
  MinusCircleOutlined,
  SettingOutlined,
};

const Sidebar = () => {
  return (
    <div className="fixed text-white flex flex-col justify-between h-screen w-64 sm:w-20 md:w-60 p-4 sm:p-2 md:p-6 gap-6 md:gap-8 z-50">
      {/* Logo Section */}
      <div className="px-2 md:px-4">
        <h1 className="text-2xl font-bold p-4 tracking-widest hidden sm:hidden md:block">
          EXTHALPY
        </h1>
        <img
          src="https://media.licdn.com/dms/image/v2/D4D0BAQEr2XO6Ut1lCA/company-logo_200_200/company-logo_200_200/0/1733901660332/exthalpy_logo?e=1741824000&v=beta&t=Q0G3QIYsvQBrK-sT8Cb49QjGxQDKjNbl_MAZ0XqQfEY"
          className="w-12 h-12 md:hidden sm:block"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul className="flex flex-col gap-2 md:gap-4">
          {sidebarNavItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            return (
              <li key={item.id}>
                <a
                  href={item.link}
                  className="flex items-center gap-2 py-2 px-4 md:py-4 md:px-6 border border-transparent hover:border-spacing-1 hover:border-current rounded-full cursor-pointer box-border"
                >
                  <IconComponent className="text-lg" />
                  <span className="hidden sm:hidden md:inline">
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div>
        <button className="flex justify-center items-center gap-2 py-2 px-4 md:py-4 md:px-6 border border-transparent hover:border-spacing-1 hover:border-current rounded-full cursor-pointer box-border">
          <LogoutOutlined className="text-lg" />
          <span className="hidden sm:hidden md:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
