export class Page {
    size = 0;
    total = 0;
    pageNumber = 0;
}

export class SnpPage extends Page {
    query;
    sources: string[];
    snps: any;
}
