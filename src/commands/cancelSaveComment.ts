import {Uri, CommentController } from "vscode";
import NewComment from "../newComment";

export default function cancelSaveComment(
    comment: NewComment,
    currentActiveFile: Uri | null, 
    commentController: CommentController, 
    ) {
        if (!comment.parent) {
            return;
          }
          comment.parent.dispose();
          NewComment.disposeAllCommentThreads();
          NewComment.showCommentThread(currentActiveFile, commentController);
}