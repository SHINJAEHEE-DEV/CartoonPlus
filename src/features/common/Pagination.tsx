interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= 0 || totalPages <= 1 && !pageSizeOptions) {
    return null;
  }

  // 페이지 번호 리스트 계산 (최대 5개 노출 및 스마트 축약)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        margin: '28px 0 12px',
      }}
      role="navigation"
      aria-label="페이지 네비게이션"
    >
      {/* 이전 페이지 버튼 */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          padding: '8px 14px',
          borderRadius: '999px',
          border: '2px solid #1E1E1E',
          background: currentPage <= 1 ? '#EAE5D9' : '#FFFFFF',
          color: currentPage <= 1 ? '#9E9789' : '#1E1E1E',
          fontSize: '13px',
          fontWeight: 800,
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
        }}
        aria-label="이전 페이지"
      >
        ← 이전
      </button>

      {/* 페이지 번호 목록 */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {pages.map((p, idx) => {
          if (typeof p === 'string') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: '4px 8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#8A8175',
                }}
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;

          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid #1E1E1E',
                background: isActive ? '#1E1E1E' : '#FFFFFF',
                color: isActive ? '#FED943' : '#1E1E1E',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                boxShadow: isActive ? '2px 2px 0 #8A6A00' : 'none',
                transition: 'all 0.15s ease',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* 다음 페이지 버튼 */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          padding: '8px 14px',
          borderRadius: '999px',
          border: '2px solid #1E1E1E',
          background: currentPage >= totalPages ? '#EAE5D9' : '#FFFFFF',
          color: currentPage >= totalPages ? '#9E9789' : '#1E1E1E',
          fontSize: '13px',
          fontWeight: 800,
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
        }}
        aria-label="다음 페이지"
      >
        다음 →
      </button>

      {/* 페이지당 보기 옵션 (선택적) */}
      {pageSizeOptions && onPageSizeChange && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '10px',
              border: '2px solid #1E1E1E',
              background: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}개씩 보기
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
