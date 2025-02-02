import { type ChildrenUpdates } from "@webstudio-is/sdk";
import {
  type SerializedTextNode,
  type SerializedElementNode,
  type SerializedRootNode,
  type SerializedLexicalNode,
} from "../lexical";
import { type SerializedInstanceNode } from "../nodes/node-instance";

type Node =
  | SerializedRootNode
  | SerializedElementNode
  | SerializedTextNode
  | SerializedLexicalNode
  | SerializedInstanceNode;

export const toUpdates = (
  node: Node,
  updates: ChildrenUpdates = []
): ChildrenUpdates => {
  if (node.type === "text" && "text" in node) {
    updates.push(node.text);
  }

  if (node.type === "instance" && "instance" in node) {
    if ("isNew" in node && node.isNew === true) {
      updates.push({
        id: node.instance.id,
        text: node.text,
        component: node.instance.component,
        createInstance: true,
      });
    } else {
      updates.push({
        id: node.instance.id,
        text: node.text,
      });
    }
  }

  if ("children" in node) {
    for (const child of node.children) {
      if (child.type === "paragraph" && updates.length !== 0) {
        updates.push("\n");
      }

      toUpdates(child, updates);
    }
  }

  return updates;
};
