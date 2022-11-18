import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

const Tip: React.FC<any> = (props) => {
  const { title, placement = 'top' } = props;
  return (
    <Tooltip
      title={title}
      arrowPointAtCenter={true}
      placement={placement}
      overlayStyle={{ width: 'auto' }}
    >
      <QuestionCircleOutlined style={{ marginLeft: '8px', color: '#000' }} />
    </Tooltip>
  );
};

export default Tip;
