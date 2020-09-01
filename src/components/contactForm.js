import React from "react"
import { createPortal } from "react-dom"

const ContactForm = () => {
  return (
    <div className="contact-form">
      <div className="container">
        <h3>Start a conversation</h3>
        <p>me: Hi, I'm Dérick</p>
        <p>you: Hi, I'm</p>
        <input type="text" placeholder="enter your name" />
        <p>First, I'll give you my email so you can get back to me</p>
        <input type="text" placeholder="enter your email" />
        <p>me: Thanks! tell me about </p>
      </div>
    </div>
  )
}

export default ContactForm
