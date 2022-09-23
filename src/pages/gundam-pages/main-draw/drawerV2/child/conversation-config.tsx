import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Radio, Select } from 'antd';
import LabelSelect from '../../drawer/components/label-select';
import CvsInput from '../components/cvs-input';
import SoundRadio from '../components/sound-radio';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const ConversationConfig = (props: any) => {
  const { form, name, title = '答复配置', placeholder = '答复内容', required } = props;
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
                {fields.map((field: any, index: number) => {
                  const sound = () => {
                    return (
                      <div style={{ display: 'flex' }}>
                        <Form.Item
                          name={[field.name, 'soundType']}
                          fieldKey={[field.fieldKey, 'soundType']}
                          initialValue={1}
                        >
                          <Radio.Group>
                            <Radio value={1}>全合成</Radio>
                            <Radio value={2}>录音半合成</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Button
                          type="link"
                          onClick={() => {
                            console.log(
                              form.getFieldsValue()['strategyList'][0]['conversationList'][index],
                            );
                          }}
                        >
                          试听
                        </Button>
                      </div>
                    );
                  };
                  return (
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
                            required
                            sound={sound}
                          />
                        </Form.Item>

                        <SoundRadio
                          name={name}
                          form={form}
                          index={index}
                          field={field}
                          formName={['strategyList', 0, 'conversationList', index]}
                        />

                        <Form.Item
                          name={[field.name, 'textLabels']}
                          fieldKey={[field.fieldKey, 'textLabels']}
                          label="选择标签"
                        >
                          <LabelSelect color="magenta"></LabelSelect>
                        </Form.Item>
                      </div>
                    </div>
                  );
                })}

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
