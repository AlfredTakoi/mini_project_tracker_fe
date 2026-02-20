import { Button, Col, Drawer, Form, Input, Popconfirm, Row } from "antd";

export function CreateEditProjectDrawer({
  editingRecord,
  form,
  handleSubmit,
  handleDelete,
  onClose,
  open,
  loading,
  loadingDelete,
}) {
  return (
    <Drawer
      title={editingRecord ? "Edit Project" : "Create New Project"}
      size={400}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Project Name"
              rules={[
                { required: true, message: "Please enter Project Name" },
              ]}
            >
              <Input placeholder="Please enter Project Name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="flex gap-2">
              <Button className="focus:outline-none focus:border-none hover:outline-none active:outline-none" onClick={onClose}>Cancel</Button>
              <Button htmlType="submit" type="primary" loading={loading}>
                Submit
              </Button>
              {editingRecord && (
                <Popconfirm
                  title="Delete this project?"
                  description="This action cannot be undone."
                  onConfirm={async () => {
                    await handleDelete(editingRecord.id);
                    onClose();
                  }}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button color="danger" variant="solid" loading={loadingDelete}>
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
