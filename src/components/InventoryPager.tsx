import type { ReactNode } from 'react'
import { PAGE_SIZES, type PageSize } from '../core/aging'
import './InventoryPager.css'

type InventoryPagerProps = {
  currentPage: number
  pageSize: PageSize
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}

type InventoryMiniPagerProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

type PageItem = number | `gap-${number}`

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const PreviousIcon = () => (
  <Icon>
    <path d="m15 18-6-6 6-6" />
  </Icon>
)
const NextIcon = () => (
  <Icon>
    <path d="m9 18 6-6-6-6" />
  </Icon>
)
const FirstIcon = () => (
  <Icon>
    <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
  </Icon>
)
const LastIcon = () => (
  <Icon>
    <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
  </Icon>
)

export function InventoryMiniPager({
  currentPage,
  totalPages,
  onPageChange,
}: InventoryMiniPagerProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="inventory-mini-pager" aria-label="Page navigation">
      <button
        className="inventory-pager__button inventory-pager__button--nav"
        type="button"
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <PreviousIcon />
      </button>
      <span aria-live="polite">
        Page {currentPage} / {totalPages}
      </span>
      <button
        className="inventory-pager__button inventory-pager__button--nav"
        type="button"
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <NextIcon />
      </button>
    </nav>
  )
}

export function InventoryPager({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: InventoryPagerProps) {
  const pageItems = getPageItems(currentPage, totalPages)
  const firstResult = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastResult = Math.min(currentPage * pageSize, totalItems)

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
        <span className="inventory-pager__range">
          <b>
            {firstResult}-{lastResult}
          </b>{' '}
          of <b>{totalItems}</b>
        </span>
      </div>
      <div className="inventory-pager__navigation">
        <button
          className="inventory-pager__button inventory-pager__button--nav"
          type="button"
          aria-label="First page"
          disabled={currentPage <= 1 || totalPages === 0}
          onClick={() => onPageChange(1)}
        >
          <FirstIcon />
        </button>
        <button
          className="inventory-pager__button inventory-pager__button--nav"
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1 || totalPages === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <PreviousIcon />
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
        <button
          className="inventory-pager__button inventory-pager__button--nav"
          type="button"
          aria-label="Next page"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <NextIcon />
        </button>
        <button
          className="inventory-pager__button inventory-pager__button--nav"
          type="button"
          aria-label="Last page"
          disabled={currentPage >= totalPages || totalPages === 0}
          onClick={() => onPageChange(totalPages)}
        >
          <LastIcon />
        </button>
      </div>
    </nav>
  )
}

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  if (currentPage <= 3) {
    ;[2, 3, 4].forEach((page) => pages.add(page))
  }
  if (currentPage >= totalPages - 2) {
    ;[totalPages - 1, totalPages - 2, totalPages - 3].forEach((page) => pages.add(page))
  }

  const sortedPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right)
  const items: PageItem[] = []
  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]
    if (previousPage !== undefined && page - previousPage > 1) {
      items.push(`gap-${page}`)
    }
    items.push(page)
  })

  return items
}
