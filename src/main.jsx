import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

function getOrCreateRootElement(id = "root") {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement("div")
    el.id = id
    document.body.appendChild(el)
  }
  return el
}

const container = getOrCreateRootElement()

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
