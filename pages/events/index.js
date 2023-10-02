import Layout from "@/components/Layout"
import EventItem from "@/components/EventItem"
import { API_URL, PER_PAGE } from "@/config/index"
import Pagination from "@/components/Pagination"

export default function EventsPage({ events, page, total }) {

  return (
    <Layout>
      <h1>Events</h1>
      {events.data.length === 0 && <h3>No events to show</h3>}

      {events.data.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      <Pagination page={page} total={total} />
    </Layout>
  )
}

export async function getServerSideProps({ query: { page } }) {
  // Calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE


  const res = await fetch(`${API_URL}/api/events?sort=date:asc&populate=image&pagination[limit]=${PER_PAGE}&pagination[start]=${start}`)
  const events = await res.json()

  const total = events.meta.pagination.total
  return {
    props: { events, page: +page, total },
  }
}