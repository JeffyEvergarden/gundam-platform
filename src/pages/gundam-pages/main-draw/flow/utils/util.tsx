// 判断有向无环图

// 目标节点不能是父族辈节点
// 源节点的父族旁节点不能连接

interface TNode {
  id: any;
  parents: TNode[];
  children: TNode[];
}

class TNode {
  constructor(node: any) {
    this.id = node.id;
    this.parents = [];
    this.children = [];
  }
}
// 判断有无环
export const judgeLineByNode = (line: any, info: any[]) => {
  const [nodes, lines] = info;
  const arr = [];
  const map = new Map();
  nodes.forEach((item: any) => {
    const tmp = new TNode(item);
    arr.push(tmp);
    map.set(tmp.id, tmp);
  });
  // 连接关系
  lines.forEach((item: any) => {
    if (item.id === line.id) {
      return;
    }
    const sourceNode = map.get(item.source);
    const targetNode = map.get(item.target);
    sourceNode.children.push(targetNode);
    targetNode.parents.push(sourceNode);
  });

  const source = map.get(line.source); // 头节点
  const target = map.get(line.target); // 尾节点

  // 目标节点不能是父族辈节点
  const set = new Set();
  const parents = [source];
  while (parents.length > 0) {
    let node = parents.pop();
    // 不存在则推进set
    node.parents.forEach((parent: any) => {
      if (!set.has(parent)) {
        // 不存在才push
        set.add(parent);
        parents.push(parent);
      }
    });
  }
  // 此时set 已收集完父祖辈的节点
  const setArr = Array.from(set).map((item: any) => item.id);
  // 是否有环
  const flag = setArr.indexOf(target.id) > -1;
  // 校验完成 返回表示节点合法
  // 存在环返回false 不存在则 true
  return !flag;
};

// store
