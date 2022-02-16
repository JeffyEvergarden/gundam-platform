import React from 'react';
import { Card, Input, Select, Form } from 'antd';
import { withPropsAPI } from 'gg-editor';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

const formatStr = (str: string) => {
  switch (str) {
    case 'node':
      return '节点';
    case 'edge':
      return '连线';
  }
  return '';
};

type DetailFormProps = {
  type: string;
  propsAPI?: any;
};

class DetailForm extends React.Component<DetailFormProps> {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  handleFieldChange = (values: any) => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      const item = getSelected()[0];
      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });
    }, 0);
  };

  handleInputBlur = (type: string) => (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

  renderNodeDetail = () => {
    const { label } = this.item.getModel();

    return (
      <Form initialValues={{ label }}>
        <Item label="节点名称" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

    return (
      <Form initialValues={{ label, shape }}>
        <Item label="线的名称" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
        <Item label="连线形状" name="shape" {...inlineFormItemLayout}>
          <Select onChange={(value) => this.handleFieldChange({ shape: value })}>
            <Option value="flow-smooth">顺滑</Option>
            <Option value="flow-polyline">直线</Option>
            <Option value="flow-polyline-round">顺滑的直线</Option>
          </Select>
        </Item>
      </Form>
    );
  };

  render() {
    const { type } = this.props;
    if (!this.item) {
      return null;
    }

    return (
      <Card type="inner" size="small" title={formatStr(type)} bordered={false}>
        {type === 'node' && this.renderNodeDetail()}
        {type === 'edge' && this.renderEdgeDetail()}
      </Card>
    );
  }
}

export default withPropsAPI(DetailForm as any);
