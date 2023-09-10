import Layout from "@/components/Layout"
import { API_URL } from "@/config/index"
import styles from '@/styles/Event.module.css'
import { FaPenAlt, FaTimes } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"

export default function EventPage({ evt }) {
  const deleteEvent = (e) => {
    // console.log("delete")
  }

  return (
    <div>
      <Layout>
        <div className={styles.event}>
          <div className={styles.controls}>
            <Link href={`/events/edit/${evt.id}`}>
              <FaPenAlt />  Edit Event
            </Link>
            <a href="" className={styles.delete} onClick={deleteEvent}>
              <FaTimes />Delete Event
            </a>
          </div>

          <span>
            {evt.attributes.date} at {evt.attributes.time}
          </span>
          <h1>{evt.attributes.name}</h1>
          {evt.attributes.image.data && (
            <div className={styles.image}>
              <Image src={evt.attributes.image.data.attributes.formats.large.url} width={960} height={600} />
            </div>
          )}

          <h3>Performers:</h3>
          <p>{evt.attributes.performers}</p>
          <h3>Description</h3>
          <p>{evt.attributes.description}</p>
          <h3>Venue: {evt.attributes.venue}</h3>
          <p>{evt.attributes.address}</p>

          <Link href='/events' className={styles.back}>
            {'<'} Go Back
          </Link>
        </div>
      </Layout>
    </div>
  )
}


export async function getServerSideProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=image`)
  const events = await res.json()

  return {
    props: {
      evt: events.data[0]
    }
  }
}