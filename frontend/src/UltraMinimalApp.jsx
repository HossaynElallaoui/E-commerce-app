import React from 'react'

function UltraMinimalApp() {
    return (
        <div style={{
            background: 'red',
            color: 'white',
            fontSize: '50px',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 99999
        }}>
            VITE IS WORKING!
        </div>
    )
}

export default UltraMinimalApp
