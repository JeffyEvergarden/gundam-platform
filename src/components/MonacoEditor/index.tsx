import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor, { useMonaco, loader } from '@monaco-editor/react';
import { useRef, useState } from 'react';

// import { loader } from "@monaco-editor/react";

loader.config({ monaco });

const MonacoEditor1 = (props: any) => {
  const {} = props;
  const editorRef: any = useRef(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const [text, setText] = useState<any>('');

  return (
    <MonacoEditor
      height="300px"
      width="500px"
      value={text}
      language="python"
      // theme="vs-dark"
      onMount={handleEditorDidMount}
      onChange={(value: any, event: any) => {
        console.log(value, event);
        setText(value);
      }}
    />
  );
};

export default MonacoEditor1;
