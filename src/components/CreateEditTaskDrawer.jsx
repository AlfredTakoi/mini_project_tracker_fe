import { Button, Col, Drawer, Form, Input, Popconfirm, Row, Select } from "antd";

export function CreateEditTaskDrawer({
  editingRecordTask,
  form,
  handleSubmit,
  handleDelete,
  onClose,
  open,
  loading,
  projects,
  loadingDelete,
  dependencies,
}) {
  return (
    <Drawer
      title={editingRecordTask ? "Edit Task" : "Create New Task"}
      size={500}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Task Name"
              rules={[{ required: true, message: "Please enter Project Name" }]}
            >
              <Input placeholder="Please enter Project Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="weight"
              label="Weight"
              rules={[{ required: true, message: "Please enter Weight" }]}
            >
              <Input type={"number"} placeholder="Please enter Weight" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please enter Status" }]}
            >
              <Select placeholder="Select Status" style={{ borderRadius: 8 }}>
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="done">Done</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="project_id"
              label="Project"
              rules={[{ required: true, message: "Please enter Project" }]}
            >
              <Select
                placeholder="Select Project"
                name="project_id"
                style={{ borderRadius: 8 }}
              >
                {projects.map((project) => (
                  <Select.Option key={project.id} value={project.id}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{project.name}</div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="dependencies"
              label="Dependencies"
              rules={[{ required: false, message: "Please enter Dependencies" }]}
            >
              <Select
                placeholder="Select Dependencies"
                name="dependency_ids"
                mode="multiple"
                style={{ borderRadius: 8 }}
              >
                {dependencies.map((task) => (
                  <Select.Option key={task.id} value={task.id}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{task.name}</div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="flex gap-2">
              <Button
                className="focus:outline-none focus:border-none hover:outline-none active:outline-none"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button htmlType="submit" type="primary" loading={loading}>
                Submit
              </Button>
              {editingRecordTask && (
                <Popconfirm
                  title="Delete this task?"
                  description="This action cannot be undone."
                  onConfirm={async () => {
                    await handleDelete(editingRecordTask.id);
                    onClose();
                  }}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button htmlType="button" danger loading={loadingDelete}>
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </div>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}
