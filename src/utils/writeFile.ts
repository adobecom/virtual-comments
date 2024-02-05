import NewComment from "../newComment";
import { config } from "../config/config";
import * as fs from "fs";

function createCommentObject(key: string, value: string): Record<string, string> {
    const obj: Record<string, string> = {};
    obj[key] = value;
    return obj;
}

export default function write(newComment: NewComment) {
    const lineNo = newComment.parent
    ? newComment.parent.range.start.line + 1
    : newComment.line;
  const lineText = config.document?.lineAt(lineNo - 1).text || '';
  const commentObj = createCommentObject(lineNo + "-" + btoa(lineText), newComment.body.toString());
  // Read the existing data from the file
  let existingData: any[] = [];
  const folderPath = config.commentJSONPath;
  const separatingIndex = folderPath.lastIndexOf("/");
  const p1 = folderPath.slice(0, separatingIndex);
  //case: file already exists
  if (fs.existsSync(folderPath)) {
    const fileContent = fs.readFileSync(folderPath, "utf8");
    existingData = JSON.parse(fileContent);
  }
  const updatedData = { ...existingData, ...commentObj };
  const jsonContent = JSON.stringify(updatedData, null, 2);
  try {
    fs.mkdirSync(p1, { recursive: true });
  } catch (e) {
    console.log(e);
  }
  fs.writeFileSync(folderPath, jsonContent, "utf8");
  }