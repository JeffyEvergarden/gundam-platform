import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import config from './const';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

const EditBoard: React.FC<any> = (prop: any) => {
  const { value, onChange } = prop;

  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  // onchange事件 内容变动
  const onChangeContent = (editor: any) => {
    let content = editor.getHtml();
    onChange(content);
  };

  // 编辑器配置
  const toolbarConfig = {
    excludeKeys: ['fullScreen'], // 去除全屏
  };

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
  };
  // 上传图片的配置
  (editorConfig.MENU_CONF as any)['uploadImage'] = {
    withCredentials: true,
    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 1,
    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 4 * 1024 * 1024, // 4M
    // 上传地址
    server: '/aichat/robot/file/uploadFile',
    customInsert(res: any, insertFn: any) {
      // res 即服务端的返回结果
      let urlId = res?.data;
      if (!urlId || typeof urlId !== 'string') {
        message.warning('图片上传失败');
        return;
      }
      let path = config.GET_IMG_URL + urlId;

      // 从 res 中找到 url alt href ，然后插图图片
      insertFn?.(path, urlId, '');
    },
  };

  // 上传视频的配置
  (editorConfig.MENU_CONF as any)['uploadVideo'] = {
    withCredentials: true,
    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 1,
    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 50 * 1024 * 1024, // 4M
    // 上传地址
    server: '/aichat/robot/file/uploadFile',
    timeout: 60 * 1000,
    customInsert(res: any, insertFn: any) {
      // res 即服务端的返回结果
      let urlId = res?.data;
      if (!urlId || typeof urlId !== 'string') {
        message.warning('视频上传失败');
        return;
      }
      let path = config.GET_VIDEO_URL + urlId + '&type=video';
      // 从 res 中找到 url alt href ，然后插图图片
      insertFn?.(path);
    },
  };

  // 插入超链接
  const insertLink = () => {};

  useEffect(() => {
    console.log(editor);

    // 页面删除时销毁
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div style={{ border: '1px solid #D9D9D9' }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      ></Toolbar>
      <div>
        {' '}
        <Button type="link">插入超链接</Button>
      </div>
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={onChangeContent}
        mode="default"
        style={{ height: '300px' }}
      />
    </div>
  );
};

export default EditBoard;
