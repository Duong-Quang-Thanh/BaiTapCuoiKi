import { Pie } from '@ant-design/plots';

export default function Statistics({
  data,
}: any) {
  const chartData = [
    {
      type: 'Approved',
      value:
        data?.approved || 0,
    },
    {
      type: 'Rejected',
      value:
        data?.rejected || 0,
    },
    {
      type: 'Pending',
      value:
        data?.pending || 0,
    },
  ];

  const config = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    height: 350,
    label: {
      text: 'value',
    },
    legend: {
      color: {
        title: false,
        position: 'right',
      },
    },
  };

  return (
    <div
      style={{
        marginBottom: 30,
      }}
    >
      <Pie {...config} />
    </div>
  );
}