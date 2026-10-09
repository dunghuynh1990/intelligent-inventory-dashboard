import { PAGE_SIZES, type PageSize } from '../core/aging'
import './InventoryPager.css'

type InventoryPagerProps = {
  currentPage: number
  pageSize: PageSize
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}

type PageItem = number | 'leading-ellipsis' | 'trailing-ellipsis'

export function InventoryPager({
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: InventoryPagerProps) {
  const pageItems = getPageItems(currentPage, totalPages)

  const handlePageSizeChange = (value: string) => {
    const selectedPageSize = PAGE_SIZES.find(
      (candidate) => candidate.toString() === value,
    )
    if (selectedPageSize !== undefined) {
      onPageSizeChange(selectedPageSize)
    }
  }

  return (
    <nav className="inventory-pager" aria-label="Inventory pagination">
      <div className="inventory-pager__size">
        <label htmlFor="inventory-page-size">Rows per page</label>
        <select
          id="inventory-page-size"
          value={pageSize}
          onChange={(event) => handlePageSizeChange(event.currentTarget.value)}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="inventory-pager__navigation">
        <button
          className="inventory-pager__button"
          type="button"
          aria-label="First page"
          disabled={currentPage <= 1 || totalPages === 0}
          onClick={() => onPageChange(1)}
        >
          First
        </button>
        <button
          className="inventory-pager__button"
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1 || totalPages === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <ol className="inventory-pager__pages" aria-label="Page numbers">
          {pageItems.map((item) =>
            typeof item === 'number' ? (
              <li key={item}>
                <button
                  className="inventory-pager__button inventory-pager__page-number"
                  type="button"
                  aria-label={`Page ${item}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                  disabled={item === currentPage}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              </li>
            ) : (
              <li key={item} className="inventory-pager__ellipsis" aria-hidden="true">
                …
              </li>
            ),
          )}
        </ol>
        <span className="inventory-pager__page-status" aria-live="polite">
          {totalPages === 0 ? 'No pages' : `Page ${currentPage} of ${totalPages}`}
        </span>
        <button
          className="inventory-pager__button"
          type="button"
          aria-label="Next page"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
        <button
          className="inventory-pager__button"
          type="button"
          aria-label="Last page"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </button>
      </div>
    </nav>
  )
}

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'trailing-ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'leading-ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    'leading-ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'trailing-ellipsis',
    totalPages,
  ]
}
