import React from 'react'

function RegisterPage() {
  return (
    <div className='container'>
        <div className="page-header">Register
        <div className="form">
            <div className="mb-3">
                <label htmlFor="">Name</label>
                <input 
                type="text" 
                className="form-control"
                //value  = {firstName}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="">Email</label>
                <input type="email"
                className="form-control"
                //value  = {email}
                />
            </div>
             <div className='mb-3'>
            <label htmlFor=''>Phone Number</label>
            <input
                //onChange={(e) => setPhone(e.target.value)}
                type='tel'
                className='form-control'
                //value={phone}
            />
            </div>
            <div className='mb-3'>
            <label htmlFor=''>Password</label>
            <input
                //onChange={(e) => setPassword(e.target.value)}
                type='password'
                className='form-control'
                //value={password}
            />
            </div>
            <div className='mb-3'>
            <label htmlFor=''>Confirm Password</label>
            <input
                //onChange={(e) => setConfirmPassword(e.target.value)}
                type='password'
                className='form-control'
                //value={confirmPassword}
            />
            </div>
            <div className='mb-3'>
                Already have an account?
                <button className='btn btn-link'>Login here</button>
            </div>
            <button
            //onClick={onRegister}
            className='btn btn-success'
            >
            Register
          </button>
        </div>
        </div>
    </div>
  )
}

export default RegisterPage