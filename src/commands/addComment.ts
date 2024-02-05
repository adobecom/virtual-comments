import { CommentReply, Uri, CommentController, CommentMode } from "vscode";
import NewComment from "../newComment";
import { CodelensProvider } from "../codeLensProvider";
import write from "../utils/writeFile";

export default function addComment(
    reply: CommentReply,
    currentActiveFile: Uri | null, 
    commentController: CommentController, 
    codelensProvider: CodelensProvider
    ) {
        const thread = reply.thread;
        thread.canReply = false;
        thread.label = " ";
        const newComment = new NewComment(
          reply.text,
          thread.range.start.line + 1,
          CommentMode.Preview,
          { name: "" },
          thread,
          undefined
        );
        newComment.label = " ";
        write(newComment);
        thread.comments = [...thread.comments, newComment];
        NewComment.disposeAllCommentThreads();
        NewComment.showCommentThread(currentActiveFile, commentController);
        codelensProvider.docChanged();    
        thread.dispose();
}