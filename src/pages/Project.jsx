import { useEffect, useState } from "react";
import { Divider, Button, Collapse, Drawer, Form, Input, Row, Badge, Col, message, Spin, Tag, Popconfirm, Select } from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import api from "../libs/api";
import { CreateEditProjectDrawer } from "../components/CreateEditProjectDrawer";
import { DetailProjectDrawer } from "../components/DetailProjectDrawer";
import { CreateEditTaskDrawer } from "../components/CreateEditTaskDrawer";
import { DetailTaskDrawer } from "../components/DetailTaskDrawer";
import { ProjectItem } from "../components/ProjectItem";

const Project = () => {
  const [open, setOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingRecordTask, setEditingRecordTask] = useState(null);
  const [viewingRecordTask, setViewingRecordTask] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [dependencies, setDependencies] = useState([]);
  const [form] = Form.useForm();
  const [formTask] = Form.useForm();

  const checkStatus = (statusName) => {
    if (statusName === 'done') {
      return <Tag color="success">Done</Tag>
    } else if (statusName === "in_progress") {
      return <Tag color="blue">In Progress</Tag>
    } else {
      return <Tag color="secondary">Draft</Tag>
    }
  }

  const handleViewDetail = (item) => {
    setViewingRecord(item);
    setOpenDetail(true);
  }

  const handleViewDetailTask = (task, project = {}) => {
    // merge project metadata so we can display its name/id later
    setViewingRecordTask({
      ...task,
      project_id: task.project_id ?? project.id,
      project_name: project.name,
    });
    setOpenTaskDetail(true);
  }

   const handleDeleteTask = async (id) => {
    try {
      setLoadingDelete(true);
      await api.delete(`/tasks/${id}`);
      message.success("Task deleted successfully!");
      fetchProjects();
    } catch (error) {
      message.error("Failed to delete Task");
      console.error(error);
    } finally {
      setLoadingDelete(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await api.get('/projects')
      setProjects(res.data.data);
    } catch (error) {
      message.error("Failed to fetch projects")
    } finally {
      setLoading(false);
    }
  }

  const showDrawer = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue(record); // Populate form for edit
    } else {
      form.resetFields(); // Clear form for create
    }
    setOpen(true)
  };

  const showDrawerTask = (record = null, projectId = null) => {
    setEditingRecordTask(record);
    if (record) {
      (async () => {
        try {
          // If the record doesn't include `dependencies`, fetch full task detail
          let full = record;
          if (typeof record.dependencies === "undefined") {
            const res = await api.get(`/tasks/${record.id}`);
            full = res.data.data;
          }

          // Normalize dependencies: API may return array of ids or array of objects
          const depsRaw = full.dependencies || [];
          const deps = depsRaw.map((d) => (d && typeof d === "object" ? d.id : d));

          formTask.setFieldsValue({
            ...full,
            project_id: full.project_id ?? projectId,
            dependencies: deps,
          });
        } catch (err) {
          console.error("Failed to fetch task detail:", err);
          // fallback to record as-is
          const depsRaw = record.dependencies || [];
          const deps = depsRaw.map((d) => (d && typeof d === "object" ? d.id : d));
          formTask.setFieldsValue({
            ...record,
            project_id: record.project_id ?? projectId,
            dependencies: deps,
          });
        }
      })();
    } else {
      formTask.resetFields();
      if (projectId) {
        formTask.setFieldsValue({ project_id: projectId });
      }
    }
    setOpenTask(true);
  };

  const closeTaskDrawer = () => {
    setOpenTask(false);
    formTask.resetFields();
    setEditingRecordTask(null);
  };

  const onClose = () => {
    setOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmitTask = async (values) => {
    try {
      setLoading(true);
      // send everything as JSON so backend can parse array types properly
      const payload = {
        name: values.name,
        weight: values.weight,
        project_id: values.project_id,
        status: values.status,
        dependencies: values.dependencies || [],
      };

      if (editingRecordTask) {
        await api.put(`/tasks/${editingRecordTask.id}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        message.success("Task updated successfully!");
      } else {
        await api.post("/tasks", payload, {
          headers: { "Content-Type": "application/json" },
        });
        message.success("Task created successfully!");
      }
    } catch (error) {
      message.error(editingRecordTask ? "Failed to update Task" : "Failed to create Task");
      console.error(error);
    } finally {
      setLoading(false);
    }

    fetchProjects();
    setOpenTask(false);
  }


  // flatten all tasks for dependency selection
  const allTasks = projects.flatMap((p) =>
    (p.tasks || []).map((t) => ({ ...t, project_name: p.name, project_id: p.id, dependencies: t.dependencies  })).filter(t => !editingRecordTask || t.id !== editingRecordTask.id)
  );

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
  
      if (editingRecord) {
        await api.put(`/projects/${editingRecord.id}`, formData);
        message.success("Project updated successfully!");
      } else {
        await api.post("/projects", formData);
        message.success("Project created successfully!");
      }
    } catch (error) {
      message.error(editingRecord ? "Failed to update Project" : "Failed to create Project");
      console.error(error);
    } finally {
      setLoading(false)
    }

    fetchProjects();
    setOpen(false)
  }

  const handleDelete = async (id) => {
    try {
      setLoadingDelete(true);
      await api.delete(`/projects/${id}`);
      message.success("Project deleted successfully!");
      fetchProjects();
    } catch (error) {
      message.error("Failed to delete Project");
      console.error(error);
    } finally {
      setLoadingDelete(false);
    }
  }

  const renderPanels = (data) => {
    return data.map((item, index) => ({
      key: index + 1,
      label:
        <div className="flex gap-2">
          <p>{item.name}</p>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={(e) => {
              showDrawerTask(null, item.id);
              e.stopPropagation();
            }}
          />
        </div>,
      extra: (  // ← tambahkan ini
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
      ),
      children:
        <div>
          { item.tasks.length === 0 ? (
            <p className="text-center text-gray-400">Task Not Found</p>
          ) : (
            <ul>
              {item.tasks.map((data, index) => (
                <ProjectItem
                  key={data.id}
                  data={data}
                  item={item}
                  number={index + 1}
                  checkStatus={checkStatus}
                  handleDeleteTask={handleDeleteTask}
                  showDrawerTask={showDrawerTask}
                  handleViewDetailTask={handleViewDetailTask}
                />
              ))}
            </ul>
          )}
        </div>,
    }));
  };

  const itemProjects = renderPanels(projects);

  return (
    <>
      <div className="p-3">
        <div className="text-center">
          <h1 className="text-2xl text-center font-semibold">
            Project Tracker Management
          </h1>
          <p className="text-gray-400">You can manage project tracker here</p>
        </div>
        <Divider />
        <div className="flex gap-2 mb-3">
          <Button type="primary" size="large"  onClick={() => showDrawer()}>
            Add Project
          </Button>
          <Button size="large" onClick={() => showDrawerTask()}>Add Task</Button>
        </div>

        {/* if projects is empty, show text not found */}
        { loading ? (
          <Spin description="Loading" className="flex justify-center flex-col w-full pt-10" size="large" />
        ) : (
            projects.length === 0 ? (
              <p className="text-center text-gray-400">Project Not Found</p>
            ) : (
              <Collapse items={itemProjects} defaultActiveKey={["1"]}></Collapse>
            )
        )}

        {/* Create/Edit Project Drawer */}
        <CreateEditProjectDrawer 
          editingRecord={editingRecord}
          form={form}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          onClose={onClose}
          open={open}
          loading={loading}
          loadingDelete={loadingDelete}
        />

        {/* Detail Project Drawer */}
        <DetailProjectDrawer
          setOpenDetail={setOpenDetail}
          openDetail={openDetail}
          viewingRecord={viewingRecord}
          checkStatus={checkStatus}
        />

        {/* Create/Edit Task */}
        <CreateEditTaskDrawer
          editingRecordTask={editingRecordTask}
          form={formTask}
          handleSubmit={handleSubmitTask}
          handleDelete={handleDeleteTask}
          onClose={closeTaskDrawer}
          open={openTask}
          loading={loading}
          projects={projects}
          dependencies={allTasks}
          loadingDelete={loadingDelete}
        />

        {/* Detail Task Drawer */}
        <DetailTaskDrawer 
          openTaskDetail={openTaskDetail}
          setOpenTaskDetail={setOpenTaskDetail}
          viewingRecordTask={viewingRecordTask}
          checkStatus={checkStatus}
        />
      </div>
    </>
  );
};

export default Project;
