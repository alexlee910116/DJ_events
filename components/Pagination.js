import Link from "next/link"
import { Fragment } from "react"
import { PER_PAGE } from "@/config/index"

export default function Pagination({ page, total }) {
  const lastPage = Math.ceil(total / PER_PAGE)
  return (
    <Fragment>
      {page > 1 && (
        <Link className='btn-secondary' href={`events?page=${page - 1}`}>
          Prev
        </Link>
      )}
      {page < lastPage && (
        <Link className='btn-secondary' href={`events?page=${page + 1}`}>
          Next
        </Link>
      )}
    </Fragment>
  )
}
