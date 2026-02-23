import { Drawer, Row, Col } from "antd";

export function DetailTaskDrawer({
  openTaskDetail,
  setOpenTaskDetail,
  viewingRecordTask,
  checkStatus
}) {
  return (
    <Drawer
      title={"Detail Task"}
      size={400}
      onClose={() => setOpenTaskDetail(false)}
      open={openTaskDetail}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <h5 className="font-bold">Name</h5>
          <p>{viewingRecordTask?.name}</p>
        </Col>
        <Col span={12} className="mb-5">
          <h5 className="font-bold">Status</h5>
          <p>{checkStatus(viewingRecordTask?.status)}</p>
        </Col>
        <Col span={12}>
          <h5 className="font-bold">Weight</h5>
          <p>{viewingRecordTask?.weight}</p>
        </Col>
        <Col span={12}>
          <h5 className="font-bold">Project</h5>
          <p>{viewingRecordTask?.project_name || viewingRecordTask?.project_id}</p>
        </Col>
        <Col span={24}>
          <h5 className="font-bold">Dependencies</h5>
          <ul>
            {
              viewingRecordTask?.dependencies?.map((dependency) => (
                <li key={dependency.id}>{dependency.name}</li>
              ))
            }
          </ul>
        </Col>
      </Row>
    </Drawer>
  );
}
