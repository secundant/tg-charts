export function containsNode(currentNode, targetNode, allowSelf = true) {
  return currentNode === targetNode && !allowSelf ? false : currentNode.contains(targetNode);
}
