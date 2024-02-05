import { Uri, CommentController} from "vscode";
import * as fs from "fs";
import NewComment from "../newComment";
import { config } from "../config/config";
import { CodelensProvider } from "../codeLensProvider";

export default function deleteComment(
    comment: NewComment,
    currentActiveFile: Uri | null, 
    commentController: CommentController, 
    codelensProvider: CodelensProvider
    ) {
    const content = fs.existsSync(config.commentJSONPath)
      ? JSON.parse(fs.readFileSync(config.commentJSONPath, "utf-8"))
      : {};
    for (const key in content) {
      if (content[key] === comment.body) {
        delete content[key];
        fs.writeFileSync(
          config.commentJSONPath,
          JSON.stringify(content, null, 2)
        );
        break;
      }
    }
    comment.parent?.dispose();
    codelensProvider.docChanged();
    NewComment.disposeAllCommentThreads();
    NewComment.showCommentThread(currentActiveFile, commentController);
}