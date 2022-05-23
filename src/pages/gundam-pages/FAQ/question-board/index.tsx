import React, { useState, useEffect, useRef } from 'react';
import { message, Button, Tooltip } from 'antd';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import config from './const';
import { FilePptOutlined, DeploymentUnitOutlined, AimOutlined } from '@ant-design/icons';
import { insertLink } from './model/utils';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import style from './style.less';
import UploadFile from './components/upload-modal';
import SelectorModal from './components/selector-modal';

const EditBoard: React.FC<any> = (prop: any) => {
  const { value, onChange } = prop;

  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  // onchange事件 内容变动
  const onChangeContent = (editor: any) => {
    let content = editor.getHtml();
    onChange(content);
  };

  const bt = useRef<any>({});

  // 编辑器配置
  const toolbarConfig = {
    excludeKeys: ['fullScreen'], // 去除全屏
    insertKeys: {
      index: 24,
      keys: ['uploadOursFile', 'openRelationModal'], //自定义
    },
  };

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...  限制2000字',
    MENU_CONF: {},
    maxLength: 2000,
  };
  // 上传图片的配置
  (editorConfig.MENU_CONF as any)['uploadImage'] = {
    withCredentials: true,
    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 1,
    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 5 * 1024 * 1024, // 5M
    // 上传地址
    server: config.UPLOAD_FILE,
    fieldName: 'file',
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
    // 单个文件上传失败
    onFailed(file: File, res: any) {
      message.warning(`${file.name} 上传失败`);
      console.log(`${file.name} 上传失败`, res);
    },
    // 上传错误，或者触发 timeout 超时
    onError(file: File, err: any, res: any) {
      message.warning(`${file.name} 上传出错, 限制大小为5MB的图片`);
      console.log(`${file.name} 上传出错`, err, res);
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
    server: config.UPLOAD_FILE,
    fieldName: 'file',
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
    // 单个文件上传失败
    onFailed(file: File, res: any) {
      message.warning(`${file.name} 上传失败`);
      console.log(`${file.name} 上传失败`, res);
    },
    // 上传错误，或者触发 timeout 超时
    onError(file: File, err: any, res: any) {
      message.warning(`${file.name} 上传出错, 限制大小为50MB的视频`);
      console.log(`${file.name} 上传出错`, err, res);
    },
  };

  (editorConfig.MENU_CONF as any)['uploadOursFile'] = {
    onClick: () => {
      (bt.current as any)?.click?.();
    },
  };

  const selectModalRef = useRef<any>();
  // 打开弹窗
  const openModal = () => {
    (selectModalRef.current as any).open({
      showFlow: false,
      info: {},
    });
  };
  // 选择标准问弹窗
  const confirm = (obj: any) => {
    console.log(obj);
    insertLink(editor, obj.question, '##' + obj.questionId, {
      questionId: obj.questionId,
      target: '_self',
    });
  };

  const test = () => {
    console.log(value);
    console.log(editor?.children);
  };

  (editorConfig.MENU_CONF as any)['openRelationModal'] = {
    onClick: () => {
      openModal?.();
    },
  };

  // 插入超链接
  const _insertLink = (info: any) => {
    insertLink(editor, info.fileName, info.path);
  };

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

      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={onChangeContent}
        mode="default"
        style={{ height: '300px' }}
      />

      <div className={style['toolbar']}>
        <UploadFile submit={_insertLink}>
          <span ref={bt}></span>
        </UploadFile>

        <SelectorModal cref={selectModalRef} confirm={confirm} />
      </div>
    </div>
  );
};

export default EditBoard;
