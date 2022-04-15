import { Form, Input, Select, Button, Checkbox, Space, Radio } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import LabelSelect from '../../drawer/components/label-select';
import CvsInput from '../components/cvs-input';
import Condition from '@/components/Condition';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const ConversationConfig = (props: any) => {
  const { name, title = '答复配置', placeholder = '答复内容' } = props;
  return (
    <div className={styles['conversation-list']}>
      <FormList name={name}>
        {(fields, { add, remove }) => {
          const addNew = () => {
            let length = fields.length;
            // console.log(length);
            add(
              {
                actionText: '',
                textLabels: [],
              },
              length,
            );
          };

          return (
            <div>
              <div className={styles['zy-row']} style={{ marginBottom: '10px' }}>
                <div className={styles['title_sp']}>{title}</div>
              </div>

              <div className={styles['cvs-box']}>
                {fields.map((field: any, index: number) => (
                  <div key={field.key} className={styles['list-box']}>
                    <div style={{ lineHeight: '32px' }}>
                      <span
                        className={styles['del-bt']}
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <MinusCircleOutlined />
                      </span>
                      <span className={styles['cvs-num']}>{index + 1}.</span>
                    </div>
                    <div style={{ flex: '1 1 auto' }}>
                      {/* 类型 */}
                      <Form.Item
                        name={[field.name, 'actionText']}
                        fieldKey={[field.fieldKey, 'actionText']}
                        rules={[{ required: true, message: `请输入${placeholder}` }]}
                      >
                        <CvsInput
                          placeholder={`请输入${placeholder}`}
                          title={`${placeholder}：`}
                          type="textarea"
                          style={{ width: '100%' }}
                          autoComplete="off"
                        />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'textLabels']}
                        fieldKey={[field.fieldKey, 'textLabels']}
                        label="选择标签"
                      >
                        <LabelSelect color="magenta"></LabelSelect>
                      </Form.Item>
                    </div>
                  </div>
                ))}

                <div>
                  <Button
                    type="link"
                    icon={<AppstoreAddOutlined />}
                    style={{ marginLeft: '10px' }}
                    onClick={addNew}
                  >
                    新增{placeholder}
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      </FormList>
    </div>
  );
};

export default ConversationConfig;
