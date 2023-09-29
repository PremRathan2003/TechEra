import './index.css'
import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConsonants = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConsonants.initial,
    courseData: [],
  }

  componentDidMount() {
    this.getCourse()
  }

  getCourse = async () => {
    this.setState({apiStatus: apiStatusConsonants.loading})
    const url = ' https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formatData = data.courses.map(each => ({
        id: each.id,
        name: each.name,
        logoUrl: each.logo_url,
      }))
      this.setState({
        apiStatus: apiStatusConsonants.success,
        courseData: formatData,
      })
    } else {
      this.setState({apiStatus: apiStatusConsonants.fail})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-con">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {courseData} = this.state
    return (
      <>
        <h1 className="heading">Courses</h1>
        <ul className="list-container">
          {courseData.map(eachItem => (
            <Link to={`/courses/${eachItem.id}`} className="link">
              <li className="list-item" key={eachItem.id}>
                <img
                  src={eachItem.logoUrl}
                  alt={eachItem.name}
                  className="logo_url"
                />
                <p className="course-name">{eachItem.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </>
    )
  }

  retry = () => {
    this.getCourse()
  }

  renderFailView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.retry()}>
        Retry
      </button>
    </div>
  )

  renderCourses = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConsonants.success:
        return this.renderSuccessView()
      case apiStatusConsonants.fail:
        return this.renderFailView()
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
        <div className="home-container">{this.renderCourses()}</div>
      </>
    )
  }
}
export default Home
