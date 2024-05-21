import { Schema, Document, SchemaOptions, ToObjectOptions } from 'mongoose';

const deleteAtPath = (obj: any, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (obj[path[index]]) {
    deleteAtPath(obj[path[index]], path, index + 1);
  }
};

const toJSON = (schema: Schema): void => {
  const defaultTransform = (doc: Document, ret: any, options: any): any => {
    Object.keys(schema.paths).forEach((path) => {
      if (schema.paths[path].options && (schema.paths[path].options as any).private) {
        deleteAtPath(ret, path.split('.'), 0);
      }
    });

    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  };

  const originalTransform = schema.get('toJSON')?.transform as
    | ((doc: Document, ret: any, options: ToObjectOptions) => any)
    | undefined;

  schema.set('toJSON', {
    transform(doc: Document, ret: any, options: ToObjectOptions): any {
      defaultTransform(doc, ret, options);
      if (originalTransform) {
        return originalTransform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
