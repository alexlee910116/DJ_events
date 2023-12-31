import qs from "qs"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "@/components/Layout"
import EventItem from "@/components/EventItem"
import { API_URL } from "@/config/index"

export default function SearchPage({ events }) {
  const router = useRouter()
  return (
    <Layout title="Search Results">
      <Link href="/events">Go Back</Link>
      <h1>Search Results for {router.query.term}</h1>
      {events.length === 1 && <h3>No events to show</h3>}

      {events.data.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}
    </Layout>
  )
}

export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify({
    filters: {
      $or: [
        {
          name: {
            $contains: term
          }
        }, {
          performers: {
            $contains: term
          }
        }, {
          description: {
            $contains: term
          }
        },
        {
          venue: {
            $contains: term
          },
        }]
    }
  })

  const res = await fetch(`${API_URL}/api/events?sort=date:asc&populate=image&${query}}`);
  const events = await res.json()
  return {
    props: { events },
  }
}