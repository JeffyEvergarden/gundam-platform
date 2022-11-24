import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React from 'react';

const Tip: React.FC<any> = (props) => {
  const { title, placement = 'top', img = false } = props;
  return (
    <Popover
      content={title}
      arrowPointAtCenter={true}
      placement={placement}
      overlayStyle={
        img ? { maxWidth: 'none', zIndex: '1070' } : { maxWidth: '250px', zIndex: '1070' }
      }
    >
      <QuestionCircleOutlined style={{ marginLeft: '8px', color: '#000' }} />
    </Popover>
  );
};

export default Tip;
