import * as vscode from "vscode";
import NewComment from "../newComment";
import { config } from '../config/config';

export default function clickComment(
    text: string,
    lineNumber: number,
    commentController: vscode.CommentController,
) {
    const newComment = new NewComment(
        text,
        lineNumber,
        vscode.CommentMode.Editing,
        { name: " " }
      );
      const thread = commentController.createCommentThread(
        vscode.Uri.file(config.currentFilePath),
        new vscode.Range(lineNumber - 1, 0, lineNumber - 1, 0),
        [newComment]
      );
      thread.canReply = false;
      thread.collapsibleState = vscode.CommentThreadCollapsibleState.Expanded;
      thread.label = " ";
      newComment.parent = thread;
}