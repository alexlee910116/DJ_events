import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "@/components/Layout"
import { API_URL } from "@/config/index"
import styles from "@/styles/Form.module.css"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AddEventPage() {
  const [values, setValues] = useState({
    name: '',
    performers: '',
    venue: '',
    address: '',
    date: '',
    time: '',
    description: '',
  })

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const hasEmptyFields = Object.values(values).some((element) => element === '')

    if (hasEmptyFields) {
      toast.error('Please fill in empty fields')
    }

    const res = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
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
  return (
    <div>
      <Layout title="Add New Event">
        <Link href="/events">Go Back</Link>
        <h1>Add Event</h1>
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

          <input type="submit" value="Add Event" className="btn" />
        </form>
      </Layout>
    </div>
  )
}
