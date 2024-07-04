interface Pagination<T> {
  items: T[];
  page: number;
  size: number;
  // numOfItems: number;
  totalItems: number;
  totalPages: number;
}

export default Pagination;
