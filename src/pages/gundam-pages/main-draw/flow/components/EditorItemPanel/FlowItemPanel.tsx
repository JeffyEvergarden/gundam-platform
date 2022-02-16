import { Item, ItemPanel } from 'gg-editor';
import { Card } from 'antd';
import MyNodeList from './NodeList';
import styles from './index.less';
import { DetailPanel, NodePanel } from 'gg-editor';

interface PanelProps {
  addNode?: (node: any) => void;
  clickItem?: (node: any) => void;
}

const FlowItemPanel = (props: PanelProps) => {
  const { clickItem } = props;
  return (
    <ItemPanel className={styles.itemPanel}>
      <Item
        type="node"
        size="80*30"
        shape="flow-rect"
        model={{
          color: '#1890FF',
          label: '新节点',
        }}
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxyZWN0IGlkPSJiIiB4PSIwIiB5PSIwIiB3aWR0aD0iODAiIGhlaWdodD0iNDgiIHJ4PSI0Ii8+PGZpbHRlciB4PSItOC44JSIgeT0iLTEwLjQlIiB3aWR0aD0iMTE3LjUlIiBoZWlnaHQ9IjEyOS4yJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iYSI+PGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+PGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDQgMCIgaW49InNoYWRvd0JsdXJPdXRlcjEiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDIpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGwtb3BhY2l0eT0iLjkyIiBmaWxsPSIjRTZGN0ZGIiB4bGluazpocmVmPSIjYiIvPjxyZWN0IHN0cm9rZT0iIzE4OTBGRiIgeD0iLjUiIHk9Ii41IiB3aWR0aD0iNzkiIGhlaWdodD0iNDciIHJ4PSI0Ii8+PC9nPjx0ZXh0IGZvbnQtZmFtaWx5PSJQaW5nRmFuZ1NDLVJlZ3VsYXIsIFBpbmdGYW5nIFNDIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii42NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNCAyKSI+PHRzcGFuIHg9IjIxIiB5PSIyOSI+Tm9ybWFsPC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg=="
      />
      {/* <Card bordered={false}>
        <MyNodeList clickItem={clickItem} />
      </Card> */}
    </ItemPanel>
  );
};

export default FlowItemPanel;
