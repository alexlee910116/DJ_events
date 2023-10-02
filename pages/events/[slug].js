import Layout from "@/components/Layout"
import { API_URL } from "@/config/index"
import styles from '@/styles/Event.module.css'
import { FaPenAlt, FaTimes } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EventPage({ evt }) {
  const router = useRouter()

  const deleteEvent = async (e) => {
    if (confirm('Are you sure you want to delete this event')) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`,
        {
          method: 'DELETE',
        })

      const data = await res.json()
      console.log(data)

      if (!res.ok) {
        toast.error(data.error)
      } else {
        router.push('/events')
      }
    }
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
          <ToastContainer />
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