import * as vscode from "vscode";
import * as fs from "fs";

let commentId = 1;
const commentThreadPool: vscode.CommentThread[] = [];

export default class NewComment implements vscode.Comment {
    id: number;
    label: string | undefined;
    savedBody: string | vscode.MarkdownString;
    constructor(
      public body: string | vscode.MarkdownString,
      public line: number,
      public mode: vscode.CommentMode,
      public author: vscode.CommentAuthorInformation,
      public parent?: vscode.CommentThread,
      public contextValue?: string
    ) {
      this.id = ++commentId;
      this.savedBody = this.body;
      this.label = " ";
    }
    public static async showCommentThread(currentActiveFile: vscode.Uri | null, commentController: vscode.CommentController, path: vscode.Uri | undefined = undefined) {
      try {
        const currentFilePath = path?.path || currentActiveFile?.path || vscode.window.activeTextEditor?.document.uri.path;
        if(currentFilePath?.includes('.json')) return;
        if (currentFilePath) {
          const workspaceFolderName = vscode.workspace.workspaceFolders !== undefined ? vscode.workspace.workspaceFolders[0].name : "";
          const pathSplit = currentFilePath.split(workspaceFolderName);
          pathSplit[1] = "/.docs" + pathSplit[1] + ".json";
          const jsonPath = pathSplit.join(workspaceFolderName);
          const document = await vscode.workspace.openTextDocument(currentFilePath);
          const comments = fs.existsSync(jsonPath) ? JSON.parse((fs.readFileSync(jsonPath)).toString()) : {};
          for (const key in comments) {
            const value = comments[key];
            const lineNumber = +key.split('-')[0];
            const lineTextInDoc = document.lineAt(lineNumber-1).text;
            const lineTextInJson = key.split('-')[1];
            if (lineTextInJson === '' && lineTextInDoc !== lineTextInJson) {
              continue;
            }
            const uri = <vscode.Uri>path || currentActiveFile || vscode.window.activeTextEditor?.document.uri;
            const commentThread = commentController.createCommentThread(uri, new vscode.Range(lineNumber - 1, 0, lineNumber - 1, 0), []);
            commentThread.canReply = false;
            commentThread.collapsibleState = vscode.CommentThreadCollapsibleState.Collapsed;
            const myNewComment = new NewComment(value, lineNumber, vscode.CommentMode.Preview,
              { name: "" },
              commentThread,
              ""
            );
            commentThread.comments = [myNewComment];
            commentThreadPool.push(commentThread);
          }
        }
      } catch (error) {
        vscode.window.showWarningMessage(<string>error);
        console.error("No JSON FILE for this file", error);
      }
    }
  
    public static disposeAllCommentThreads() {
      for (const thread of commentThreadPool) {
        thread.dispose();
      }
    }
  }