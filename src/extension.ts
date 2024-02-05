"use strict";
import path = require("path");
import { window, workspace, commands, comments, languages } from "vscode";
import * as vscode from "vscode";
import { config } from "./config/config";
import { CodelensProvider } from "./codeLensProvider";
import showCommentListPanel from "./webView/webViewPanel";
import NewComment from "./newComment";
import saveComment from "./commands/saveComment";
import addComment from "./commands/addComment";
import addSnippet from "./commands/addSnippet";
import deleteComment from "./commands/deleteComment";
import cancelSaveComment from "./commands/cancelSaveComment";
import clickComment from "./commands/clickComment";

let activeFile: vscode.Uri | null = null;
const controller = comments.createCommentController("virtual-comment-system", "Virtual Comment System");

export function activate(context: vscode.ExtensionContext) {
  const sub = context.subscriptions;
  sub.push(controller);
  controller.commentingRangeProvider = {
    provideCommentingRanges: (document: vscode.TextDocument) => {
      return [new vscode.Range(0, 0, document.lineCount - 1, 0)];
    },
  };
  controller.options = {
    placeHolder: "Type a new comment or add a snippet",
    prompt: " ",
  };
  NewComment.showCommentThread(activeFile, controller);

  const codelensProvider = new CodelensProvider();
  languages.registerCodeLensProvider({ scheme: "file" }, codelensProvider);

  window.tabGroups.onDidChangeTabs((tabChangeEvent: any) => {
    NewComment.disposeAllCommentThreads();
    NewComment.showCommentThread(activeFile, controller, tabChangeEvent?.changed[0]?.input.uri || undefined);
    codelensProvider.docChanged();
  });

  window.onDidChangeActiveTextEditor((event) => {
    if (!event) return;
    if (event.document.uri.scheme === 'file' && activeFile?.path !== event?.document.uri.path && !event.document.uri.path.includes('commentinput-1')) {
      activeFile = event?.document.uri;
      const str = event.document.uri.path.split(config.folderName);
      const updatedStr = path.join(str[0], config.folderName, ".docs", str[1]);
      config.currentFilePath = event.document.uri.path;
      config.commentJSONPath = (updatedStr + ".json");
      config.document = window.activeTextEditor?.document;
      config.folderName = workspace.workspaceFolders !== undefined ? workspace.workspaceFolders[0].name : "";
      config.fileName = updatedStr.slice(updatedStr.lastIndexOf('/') + 1, updatedStr.length);
    }
  });

  sub.push(commands.registerCommand('showCommentNotifications', () => {
    if (!codelensProvider.lineChangeFlag && config.changedComments.length !== 0) {
      showCommentListPanel(config.changedComments, context, controller);
    }
  }));

  sub.push(commands.registerCommand("addComment", 
  (reply: vscode.CommentReply) => addComment(reply, activeFile, controller, codelensProvider)));

  sub.push(commands.registerCommand("addSnippet", (reply: vscode.CommentReply) => addSnippet(reply)));

  sub.push(commands.registerCommand("deleteComment", (comment: NewComment) => 
    deleteComment(comment, activeFile,controller, codelensProvider)));

  sub.push(commands.registerCommand("cancelsaveComment", (comment: NewComment) =>
    cancelSaveComment(comment, activeFile, controller)));

  sub.push(commands.registerCommand("saveComment", (comment: NewComment) =>
    saveComment(comment, activeFile, controller, codelensProvider)));

  sub.push(commands.registerCommand("clickComment", (text: string, lineNumber: number) =>
    clickComment(text, lineNumber, controller)));
}

