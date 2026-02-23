import { Button, Collapse, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { ProjectItem } from "./ProjectItem";

export function CollapsePanel({
  index,
  item,
  checkStatus,
  handleDelete,
  showDrawer,
  handleViewDetail,
  showDrawerTask,
  handleDeleteTask,
  handleViewDetailTask
}) {
  return (
    <Collapse.Panel
      header={
        <div className="flex gap-2">
          <p>{item.name}</p>
          <Button 
            type="primary" 
            size="small" 
            icon={<PlusOutlined />} 
            onClick={(e) => {
              // when adding a task from a project panel, preselect that project
              showDrawerTask(null, item.id);
              e.stopPropagation();
            }}
          >
            
          </Button>
        </div>
      } 
      key={index + 1}
      extra={ // Add extra elements to the panel header
        <div className="flex gap-2 items-center">
          <Tag color="blue" variant="solid">{+parseInt(item.completion_progress).toFixed(2)}%</Tag>
          <div className="self-center">
            {checkStatus(item.status)}
          </div>
          <Popconfirm
            title="Delete this hero project?"
            description="This action cannot be undone."
            onConfirm={(e) => {
              handleDelete(item.id)
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
              showDrawer(item);
              e.stopPropagation();
            }}
          />
            <Button
            color="blue"
            variant="filled"
            icon={<EyeOutlined />}
            onClick={(e) => {
              handleViewDetail(item);
              e.stopPropagation();
            }}
          />
        </div>
      }
    >
      <div>
        { item.tasks.length === 0 ? (
            <p className="text-center text-gray-400">Task Not Found</p>
        ) : (
          <ul>
            {
            item.tasks.map((data, index) => {
              return (
                <ProjectItem 
                  data={data}
                  item={item}
                  checkStatus={checkStatus}
                  handleDeleteTask={handleDeleteTask}
                  showDrawerTask={showDrawerTask}
                  handleViewDetailTask={handleViewDetailTask}
                />
              )
            }) 
            }
          </ul>
        )}
      </div>
    </Collapse.Panel>
  )
}
