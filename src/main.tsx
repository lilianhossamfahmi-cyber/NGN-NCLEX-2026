import React from 'react'
import ReactDOM from 'react-dom/client'
import { MasterCreatorEngine } from './engine/MasterCreator'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MasterCreatorEngine />
    </React.StrictMode>,
)
