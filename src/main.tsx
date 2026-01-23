import React from 'react'
import ReactDOM from 'react-dom/client'
import { MasterCreatorEngine } from './engine/MasterCreator'
import './index.css'

import { ErrorBoundary } from './components/ErrorBoundary';
import { ItemManagerFactory } from './services/managers/ItemManagerFactory';

// Register all specialized item managers globally
ItemManagerFactory.registerAll();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <MasterCreatorEngine />
        </ErrorBoundary>
    </React.StrictMode>,
)
