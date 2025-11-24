export class CreateCategoryDto {
    id: number;
    name: string;
    parent: string;
    children: string[];
}
