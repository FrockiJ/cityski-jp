export type ObjectType<T> = { new (): T };

export type PropertyMapper<T> = {
	[K in keyof T]: K;
};

export type PropertyTypeFactory<T> = (t: T | PropertyMapper<T>) => (string | any)[];
