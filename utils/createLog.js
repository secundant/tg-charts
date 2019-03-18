export function createLog(name) {
  console.group(`[${name}]`);
  const startedAt = performance.now();
  let startedChildrenAt = startedAt;

  return {
    markSelf: () => {
      startedChildrenAt = performance.now();
      console.debug(`[${name}] self time:`, startedChildrenAt - startedAt);
    },
    end: () => {
      const end = performance.now();

      if (startedChildrenAt !== startedAt) {
        console.debug(`[${name}] children time:`, end - startedChildrenAt);
      }
      console.debug(`[${name}] total:`, end - startedAt);
      console.groupEnd();
    }
  }
}
