import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor, { useMonaco, loader } from '@monaco-editor/react';
import { useImperativeHandle, useRef, useState } from 'react';

// import { loader } from "@monaco-editor/react";

loader.config({ monaco });

const MonacoEditor1 = (props: any) => {
  const { cref } = props;
  const editorRef: any = useRef(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const [text, setText] = useState<any>('');

  useImperativeHandle(cref, () => ({
    setText,
    text,
  }));

  return (
    <MonacoEditor
      height="600px"
      width="95%"
      value={text}
      language="python"
      theme="vs-dark"
      onMount={handleEditorDidMount}
      onChange={(value: any, event: any) => {
        setText(value);
      }}
    />
  );
};

export default MonacoEditor1;
