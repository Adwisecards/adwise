import React from "react";
import {
    TableCell,
    TableSortLabel as TableSortLabelDefault
} from "@material-ui/core";

const IconTableSorted = (props) => {
    return (
        <svg className={props.className} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.5" cy="7.5" r="7.5" transform="rotate(-180 7.5 7.5)" fill="#8152E4"/>
            <path d="M8.10353 12.8413L11.0687 9.70686C11.4088 9.34736 11.175 8.7407 10.6967 8.7407L8.79433 8.7407L8.79433 3.12345C8.79433 2.50555 8.31608 2 7.73155 2C7.14702 2 6.66877 2.50555 6.66877 3.12345L6.66877 8.7407L4.76639 8.7407C4.28814 8.7407 4.05433 9.34736 4.39442 9.69563L7.35958 12.8301C7.56151 13.0547 7.9016 13.0547 8.10353 12.8413Z" fill="#F4F6F8"/>
        </svg>
    )
}

const TableSortLabel = (props) => {
    const { item, active, sortDirection, direction, onClick } = props;

    return (
        <TableCell sortDirection={sortDirection}>
            <TableSortLabelDefault
                active={active}
                direction={direction}
                onClick={onClick}

                IconComponent={IconTableSorted}
            >
                { item.title }
            </TableSortLabelDefault>
        </TableCell>
    )
}

export default TableSortLabel
