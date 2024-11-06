import { 
    Pagination, 
    PaginationContent, 
    PaginationEllipsis, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from '@/components/ui/pagination';

interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: Function;
}

export const AdminPagination = ({ page, totalPages, setPage }: PaginationProps) => {
    return (
        <div className="max-w-fit flex space-x-2">
            <Pagination>
                <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                            onClick={page > 1 ? () => setPage(page-1) : undefined}
                            className={page === 1 ? "text-gray-400 pointer-events-none" : ""}
                        />
                    </PaginationItem>

                    {page-2 > 0 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {page-1 > 0 && (
                        <PaginationItem>
                            <PaginationLink onClick={() => setPage(page-1)}>
                                {page-1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationLink isActive>
                            {page}
                        </PaginationLink>
                    </PaginationItem>

                    {page <= totalPages-1 && (
                        <PaginationItem>
                            <PaginationLink onClick={() => setPage(page+1)}>
                                {page+1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    {page <= totalPages-2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={page < totalPages ? () => setPage(page+1) : undefined}
                            className={page === totalPages ? "text-gray-400 pointer-events-none" : ""}
                        />
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
        </div>
    );
};