import { UserOutlined } from "@ant-design/icons";
import { Avatar, Pagination, Table, Typography } from "antd";
import { useState } from "react";
import { users } from "../data/user";

// Define columns for the table
const columns = [
  {
    title: (
      <Typography.Text className="text-slate-400 text-sm">User</Typography.Text>
    ),
    dataIndex: "name",
    key: "name",
    width: 150,
    render: (text) => (
      <div className="flex items-center space-x-2">
        <Avatar
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
        />
        <div>
          <p className="text-slate-900 font-medium">{text}</p>
          <p className="text-slate-400 text-sm">Designation</p>
        </div>
      </div>
    ),
  },
  {
    title: (
      <Typography.Text className="text-slate-400">
        Total Interactions
      </Typography.Text>
    ),
    dataIndex: "totalInteractions",
    key: "totalInteractions",
    width: 150,
  },
  {
    title: (
      <Typography.Text className="text-slate-400">Time Saved</Typography.Text>
    ),
    dataIndex: "timeSaved",
    key: "timeSaved",
    width: 100,
  },
  {
    title: (
      <Typography.Text className="text-slate-400">
        Last Interaction
      </Typography.Text>
    ),
    dataIndex: "lastInteraction",
    key: "lastInteraction",
    width: 150,
  },
];

// Define data for the table
const dataSource = users.map((user) => ({
  key: user.id,
  title: <Typography.Text>{user.name}</Typography.Text>,
  name: user.name,
  email: <Typography.Text>{user.email}</Typography.Text>,
  totalInteractions: (
    <Typography.Text>{user.totalInteractions}</Typography.Text>
  ),
  timeSaved: <Typography.Text>{user.timeSaved}</Typography.Text>,
  lastInteraction: <Typography.Text>{user.lastInteraction}</Typography.Text>,
}));

const UserTable = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden border-1">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="email"
        pagination={false}
        scroll={{ y: window.innerHeight < 600 ? 200 : 450 }}
        className="responsive-table"
      />
      <div className="flex justify-center items-center">
        <Pagination
          current={page}
          onChange={(page) => setPage(page)}
          pageSize={5}
          total={users.length}
          showSizeChanger={false}
          showQuickJumper={false}
          itemActiveBg="blue"
        />
      </div>
    </div>
  );
};

export default UserTable;
