import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

const Tip: React.FC<any> = (props) => {
  const { title, placement = 'top', img = false } = props;
  return (
    <Tooltip
      title={title}
      arrowPointAtCenter={true}
      placement={placement}
      overlayStyle={img ? { maxWidth: 'none' } : {}}
    >
      <QuestionCircleOutlined style={{ marginLeft: '8px', color: '#000' }} />
    </Tooltip>
  );
};

export default Tip;
