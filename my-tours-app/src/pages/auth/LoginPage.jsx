import React from 'react'
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className='container'>
      <h2 className='page-header'>Login</h2>

      <div className='form'>
        <div className='mb-3'>
          <label htmlFor=''>Email</label>
          <input
            //onChange={(e) => setEmail(e.target.value)}
            type='email'
            className='form-control'
            placeholder='username@test.com'
          />
        </div>

        <div className='mb-3'>
          <label htmlFor=''>Password</label>
          <input
            //onChange={(e) => setPassword(e.target.value)}
            type='password'
            className='form-control'
            placeholder='#######'
          />
        </div>
        <div className='mb-3'>
          <div className='mb-3'>
            Don't have an account yet? <Link to='/register'>Register here</Link>
          </div>
          <button
            //onClick={onLogin}
            className='btn btn-success'
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage