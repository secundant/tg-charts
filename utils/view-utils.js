let id = 1;

export const nextID = name => name ? `${id++}__${name}_` : id++;
