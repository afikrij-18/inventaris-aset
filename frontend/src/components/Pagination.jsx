const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="join">
      <button
        type="button"
        className="join-item btn btn-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        «
      </button>
      <button type="button" className="join-item btn btn-sm">
        Halaman {page} dari {totalPages}
      </button>
      <button
        type="button"
        className="join-item btn btn-sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        »
      </button>
    </div>
  );
};
export default Pagination;
