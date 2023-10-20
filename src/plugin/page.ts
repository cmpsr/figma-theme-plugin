export class Page {
  protected data: Record<string, any>;
  private id: string;
  private localVariables?: ReturnType<typeof figma.variables.getLocalVariables>;

  constructor(id: string) {
    this.id = id;
    this.data = {};
  }

  private getNodePage = () => figma.getNodeById(this.id);

  protected nodeStartsWithPrefix = (nodeName: string, prefix: string) => nodeName?.startsWith(prefix);

  protected traversePage = (iterator: (sceneNode: SceneNode | BaseNode) => void) => {
    const node = this.getNodePage();
    if ((figma.editorType === 'figma' || figma.editorType === 'dev') && node) {
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
        'Looks like there was an issue. Please make sure you are using the Composer Design System and try again.'
      );
    }
  };

  protected getLocalVariables() {
    if (!this.localVariables) {
      this.localVariables = figma.variables.getLocalVariables();
    }
    return this.localVariables;
  }
}
