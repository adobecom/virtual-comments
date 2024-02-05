import {Uri, CommentController, CommentMode} from "vscode";
import edit from "../utils/editFile";
import NewComment from "../newComment";
import { CodelensProvider } from "../codeLensProvider";
import write from "../utils/writeFile";

export default function saveComment(
    comment: NewComment, 
    currentActiveFile: Uri | null, 
    commentController: CommentController, 
    codelensProvider: CodelensProvider
    ) {
    comment.mode = CommentMode.Preview;
    if (comment.contextValue === "snippet") {
      write(comment);
    } else {
      edit(comment);
    }
    NewComment.disposeAllCommentThreads();
    NewComment.showCommentThread(currentActiveFile, commentController);
    codelensProvider.docChanged();
    comment.parent?.dispose();
}