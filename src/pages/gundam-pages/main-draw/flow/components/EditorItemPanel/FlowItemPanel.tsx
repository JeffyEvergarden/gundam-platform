import Condition from '@/components/Condition';
import { Item, ItemPanel } from 'gg-editor';
import { useEffect } from 'react';
import { useModel } from 'umi';
import styles from './index.less';
interface PanelProps {
  type?: any;
}

const FlowItemPanel = (props: PanelProps) => {
  const { type } = props;

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  useEffect(() => {
    console.log(type);
  }, []);

  return (
    <ItemPanel className={styles.itemPanel}>
      {/*文本不需要这个  0文本 1语音 */}
      <Condition r-if={info?.robotType == 1 || (info?.robotType == 0 && type == 'business')}>
        <Item
          type="node"
          size="140*45"
          shape="flow-rect"
          model={{
            color: '#2890F3',
            label: '新节点',
            _nodetype: 'normal',
          }}
          src={''}
        >
          <div className={styles['blue-node']}>普通节点</div>
        </Item>
      </Condition>

      <Item
        type="node"
        size="140*45"
        shape="flow-rect"
        model={{
          color: '#ffd591',
          label: '业务流程节点',
          _nodetype: 'business',
          style: {
            stroke: '#f90',
            lineWidth: 1,
          },
        }}
        src={''}
      >
        <div className={styles['orange-node']}>业务流程节点</div>
      </Item>
    </ItemPanel>
  );
};

export default FlowItemPanel;
