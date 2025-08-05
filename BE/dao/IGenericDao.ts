export interface IGenericDao<T> {
    create(item: T): Promise<number>;
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(item: T): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}