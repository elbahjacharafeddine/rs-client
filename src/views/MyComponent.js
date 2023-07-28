import React from 'react';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';

const MyComponent = () => {
  const chartData = {
    name: 'CEO',
    children: [
      {
        name: 'Manager 1',
        children: [
          {
            name: 'Employee 1',
          },
          {
            name: 'Employee 2',
          },
        ],
      },
      {
        name: 'Manager 2',
        children: [
          {
            name: 'Employee 3',
          },
          {
            name: 'Employee 4',
          },
        ],
      },
    ],
  };

  const NodeComponent = ({ node }) => {
    return (
      <div className="custom-node">
        <div>{node.name}</div>
      </div>
    );
  };

  return (
    <div className="chart-container">
      <OrgChart
        tree={chartData}
        NodeComponent={NodeComponent}
        lineType="angle"
        direction="left"
      />
    </div>
  );
};

export default MyComponent;
