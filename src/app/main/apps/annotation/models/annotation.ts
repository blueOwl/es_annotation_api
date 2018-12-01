export interface Annotation {
    id: number;
    name: string;
    details: string;
    parent_id: number;
}

export class AnnotationNode {
    id: number;
    name: string;
    details: string;
    parent_id: number;
    level: number;
    expandable: boolean;
    children: AnnotationNode[];
}

export class AnnotationFlatNode {
    constructor(
        public id: number,
        public name: string,
        public details: string,
        public parent_id: number,
        public expandable: boolean,
        public level: number) { }
}
