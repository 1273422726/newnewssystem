import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState("");
  useEffect(() => {
    // console.log(props.content)
    const html = props.content; //把html转成
    if (html === undefined) return;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [props.content]);
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="aaaaa"
        wrapperClassName="bbbbb"
        editorClassName="ccccc"
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        onBlur={() => {
          // console.log()
          props.getContent(
            draftToHtml(convertToRaw(editorState.getCurrentContent()))
          );
        }}
      />
    </div>
  );
}
