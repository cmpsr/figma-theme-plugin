export class Page {
  id: string;
  data: {};
  constructor(id: string) {
    this.id = id;
    this.data = {};
  }

  getNodePage = () => figma.getNodeById(this.id);

  traversePage = (iterator: (child: any) => void) => {
    const node = this.getNodePage();
    if (figma.editorType === 'figma') {
      const traverse = (node: any) => {
        if ('children' in node) {
          if (node.type !== 'INSTANCE') {
            for (const child of node.children) {
              iterator(child);
              traverse(child);
            }
          }
        }
      };
      traverse(node);
    }
  };
}
