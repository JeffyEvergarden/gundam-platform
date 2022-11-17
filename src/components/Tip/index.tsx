import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

const Tip: React.FC<any> = (props) => {
  const { title } = props;
  return (
    <Tooltip title={title}>
      <QuestionCircleOutlined style={{ marginLeft: '8px' }} />
    </Tooltip>
  );
};

export default Tip;
