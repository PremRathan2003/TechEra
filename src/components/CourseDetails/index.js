import './index.css'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Header from '../Header'

const apiStatusConsonants = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

class CourseDetails extends Component {
  state = {
    apiStatus: apiStatusConsonants.initial,
    courseItem: [],
  }

  componentDidMount() {
    this.getItem()
  }

  getItem = async () => {
    this.setState({apiStatus: apiStatusConsonants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const dat = await response.json()
    if (response.ok) {
      const formattedData = {
        id: dat.course_details.id,
        name: dat.course_details.name,
        imageUrl: dat.course_details.image_url,
        description: dat.course_details.description,
      }
      this.setState({
        apiStatus: apiStatusConsonants.success,
        courseItem: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConsonants.fail})
    }
  }

  renderSuccessView = () => {
    const {courseItem} = this.state
    return (
      <div className="course-detail-container">
        <img
          src={courseItem.imageUrl}
          alt={courseItem.name}
          className="course-detail-img"
        />
        <div className="course-heading-desc">
          <h1 className="heading">{courseItem.name}</h1>
          <p className="course-detail-desc">{courseItem.description}</p>
        </div>
      </div>
    )
  }

  retry = () => {
    this.getItem()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-con">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderCourseDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConsonants.success:
        return this.renderSuccessView()
      case apiStatusConsonants.fail:
        return this.renderFailureView()
      case apiStatusConsonants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="course-details-container">
          {this.renderCourseDetails()}
        </div>
      </>
    )
  }
}
export default CourseDetails
