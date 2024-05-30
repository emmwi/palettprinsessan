export interface Project {
  project_id: number;
  name: string;
  description: string;
  image: string;
}
//interface för mönster och knitwear
export interface Item {
  item_id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  type: string;
  pdf: string;
}

export interface Fields {
  image: FieldObject[];
  pdf: FieldObject[];
}
interface FieldObject {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
