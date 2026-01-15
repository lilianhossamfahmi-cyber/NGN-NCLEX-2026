import React from 'react'
import ReactDOM from 'react-dom/client'
import { MasterCreatorEngine } from './engine/MasterCreator'
import './index.css'

import { ErrorBoundary } from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <MasterCreatorEngine />
        </ErrorBoundary>
    </React.StrictMode>,
)
