/**
 * PaginationResponseDto is a generic class that represents a paginated response.
 * It provides metadata about the pagination, such as total number of items, 
 * current page, and whether there are next or previous pages.
 * 
 * @template T - The type of the items being paginated.
 */
 export class PaginationResponseDto<T> {
  /** The list of items for the current page */
  items: T[];

  /** The total number of items */
  total: number;

  /** The current page number */
  page: number;

  /** The number of items per page */
  limit: number;

  /** Whether there is a next page */
  hasNext: boolean;

  /** Whether there is a previous page */
  hasPrev: boolean;

  /**
   * Constructor for PaginationResponseDto.
   * 
   * @param {T[]} items - The list of items for the current page.
   * @param {number} total - The total number of items.
   * @param {number} page - The current page number.
   * @param {number} limit - The number of items per page.
   */
  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.hasNext = page * limit < total;
    this.hasPrev = page > 1;
  }

  /**
   * Calculates the total number of pages.
   * 
   * @returns {number} The total number of pages.
   */
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }
}
