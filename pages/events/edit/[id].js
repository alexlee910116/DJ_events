import { useState } from "react"
import { useRouter } from "next/router"
import { FaImage } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import Layout from "@/components/Layout"
import Modal from "@/components/Modal"
import { API_URL } from "@/config/index"
import styles from "@/styles/Form.module.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUpload from "@/components/ImageUpload"

export default function EditEventPage({ evt }) {
  const [values, setValues] = useState({
    name: evt.data.attributes.name,
    performers: evt.data.attributes.performers,
    venue: evt.data.attributes.venue,
    address: evt.data.attributes.address,
    date: evt.data.attributes.date,
    time: evt.data.attributes.time,
    description: evt.data.attributes.description,
  })

  const [imagePreview, setImagePreview] = useState(evt.data.attributes.image.data ? evt.data.attributes.image.data.attributes.formats.thumbnail.url : null)

  const [showModal, setShowModal] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const hasEmptyFields = Object.values(values).some((element) => element === '')

    if (hasEmptyFields) {
      toast.error('Please fill in empty fields')
    }

    const res = await fetch(`${API_URL}/api/events/${evt.data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: values })
    })

    console.log(res);

    if (!res.ok) {
      toast.error('Something Went Wrong')
    } else {
      const evt = await res.json()
      router.push(`/events/${evt.data.attributes.slug}`)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    console.log(values);
  }

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/api/events/${evt.data.id}?&populate=image`)
    const data = await res.json()
    setImagePreview(data.data.attributes.image.data.attributes.formats.thumbnail.url)
    setShowModal(false)
  }

  return (
    <div>
      <Layout title="Edit Event">
        <Link href="/events">Go Back</Link>
        <h1>Edit Event</h1>
        <ToastContainer />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div>
              <label htmlFor="name">Event Name</label>
              <input type="text" id="name" name="name" value={values.name}
                onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="performers">Performers</label>
              <input type="text" id="performers" name="performers" value={values.performers}
                onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="venue">Venue</label>
              <input type="text" id="venue" name="venue" value={values.venue}
                onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={values.address}
                onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="date">date</label>
              <input type="date" id="date" name="date" value={values.date}
                onChange={handleInputChange} lang="en" />
            </div>
            <div>
              <label htmlFor="time">Time</label>
              <input type="text" id="time" name="time" value={values.time}
                onChange={handleInputChange} />
            </div>
          </div>
          <div>
            <label htmlFor="description">Event Description</label>
            <textarea type="text" id="description" name="description" value={values.description}
              onChange={handleInputChange} />
          </div>

          <input type="submit" value="Update Event" className="btn" />
        </form>

        <h2>Event Image</h2>
        {imagePreview ? (<Image src={imagePreview} alt="Event Image" height={100} width={170} />)
          : (<div>
            <p>No image uploaded</p>
          </div>)}

        <div>
          <button onClick={() => setShowModal(true)} className="btn-secondary">
            <FaImage /> Set Image
          </button>
        </div>
      </Layout>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload evtId={evt.data.id} imageUploaded={imageUploaded} />
      </Modal>
    </div>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/api/events/${id}?&populate=image`)
  const evt = await res.json()

  return {
    props: {
      evt
    }
  }
}