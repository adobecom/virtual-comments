import { CommentMode, CommentReply } from "vscode";
import NewComment from "../newComment";
import { config } from "../config/config";
import { getSnippet } from "../config/snippet";

export default function addSnippet(
    reply: CommentReply,
    ) {
        const lineNo = reply.thread.range.start.line;
        const lineText = config.document?.lineAt(lineNo).text;
        const snippet = getSnippet(lineText);
        reply.thread.canReply = false;
        reply.thread.label = " ";
        const newComment = new NewComment(
          snippet,
          lineNo + 1,
          CommentMode.Editing,
          { name: " " }
        );
        reply.thread.comments = [...reply.thread.comments, newComment];
        newComment.parent = reply.thread;
        newComment.contextValue = "snippet";
        newComment.label = " ";
}