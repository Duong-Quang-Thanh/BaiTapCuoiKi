import { Card } from 'antd';
import { Column } from '@ant-design/plots';

export default function Statistics(
  props: any
) {
  const data = [
    {
      type: 'Approved',
      value:
        props.data.approved,
    },
    {
      type: 'Rejected',
      value:
        props.data.rejected,
    },
    {
      type: 'Pending',
      value:
        props.data.pending,
    },
  ];

  return (
    <Card
      style={{
        marginBottom: 20,
      }}
    >
      <Column
        data={data}
        xField="type"
        yField="value"
      />
    </Card>
  );
}