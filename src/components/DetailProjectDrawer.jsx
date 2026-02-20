import { Col, Drawer, Row, Tag } from "antd";

export function DetailProjectDrawer({
  setOpenDetail,
  openDetail,
  viewingRecord,
  checkStatus,
}) {
  return (
    <Drawer
      title={"Detail Project"}
      size={400}
      onClose={() => setOpenDetail(false)}
      open={openDetail}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <h5 className="font-bold">Name</h5>
          <p>{viewingRecord?.name}</p>
        </Col>
        <Col span={12} className="mb-5">
          <h5 className="font-bold">Status</h5>
          <p>{checkStatus(viewingRecord?.status)}</p>
        </Col>
        <Col span={12}>
          <h5 className="font-bold">Status</h5>
          <Tag color="blue" variant="solid">{+parseInt(viewingRecord?.completion_progress).toFixed(2)}%</Tag>
        </Col>
      </Row>
    </Drawer>
  );
}