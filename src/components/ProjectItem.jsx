import { Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

export function ProjectItem({
  data,
  item,
  checkStatus,
  handleDeleteTask,
  showDrawerTask,
  handleViewDetailTask
}) {
  return (
    <li key={data.id}>
      <div className="flex gap-2 pb-3 border-b border-gray-200 justify-between items-center">
        <p>{data.name}</p>
        <div className="flex gap-2 items-center">
          {checkStatus(data.status)}
          <Popconfirm
            title="Delete this hero task?"
            description="This action cannot be undone."
            onConfirm={(e) => {
              handleDeleteTask(data.id)
              e.stopPropagation();
            }}
            onCancel={(e) => e.stopPropagation()}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button color="danger" onClick={(e) => e.stopPropagation()} variant="filled" icon={<DeleteOutlined />} danger />
          </Popconfirm>
          <Button
            color="orange"
            variant="filled"
            icon={<EditOutlined />}
            onClick={(e) => {
              showDrawerTask(data, item.id);
              e.stopPropagation();
            }}
          />
          <Button
            color="blue"
            variant="filled"
            icon={<EyeOutlined />}
            onClick={(e) => {
              handleViewDetailTask(data, item);
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    </li>
  )
}
