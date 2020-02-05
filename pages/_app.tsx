import React from 'react'
import App from 'next/app'
import '../public/css/tailwind.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return <Component className="" {...pageProps} />
  }
}

export default MyApp
