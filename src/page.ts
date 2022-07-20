export class Page {
  id: string;
  data: {};
  constructor(id: string) {
    this.id = id;
    this.data = {};
  }

  getNodePage = () => figma.getNodeById(this.id);

  nodeStartsWithPrefix = (nodeName: string, prefix: string) =>
    nodeName?.startsWith(prefix);

  traversePage = (iterator: (sceneNode: SceneNode | BaseNode) => void) => {
    const node = this.getNodePage();
    if (figma.editorType === 'figma' && node) {
      const traverseNode = (node: SceneNode | BaseNode) => {
        if ('children' in node) {
          if (node.type !== 'INSTANCE') {
            for (const child of node.children) {
              iterator(child);
              traverseNode(child);
            }
          }
        }
      };
      traverseNode(node);
    } else {
      throw new Error(
        'Looks like there was an issue. Please make sure you are using the Composer Design System and try again.',
      );
    }
  };
}
